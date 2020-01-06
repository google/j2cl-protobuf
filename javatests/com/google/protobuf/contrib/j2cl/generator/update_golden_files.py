# Copyright 2019 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Regenerates all golden files.

Builds all protos, reads all directories under golden_files and unzips
corresponding files into the directories (removes all old files).
"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from glob import glob
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile
from absl import app
from absl import logging


_BLAZE_TARGET = "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos:all"
_GOLDEN_FILES_BASE_PATH = "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/generator/golden_files/"
_PROTO_ZIP_OUTPUT_FILE = "blaze-bin/third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/%s_j2cl_proto_new__interop_for_testing_do_not_use.srcjar"


def ensure_google3_or_die():
  cwd = os.getcwd()
  if not cwd.endswith("/google3"):
    logging.fatal("Run this from a google3 citc client")
    sys.exit(-1)


def build_proto_zips_or_die():
  code = subprocess.call(
      ["blaze", "build", "--define", "j2cl_proto=interop", _BLAZE_TARGET])
  if code != 0:
    logging.fatal("Blaze build of protos failed")
    sys.exit(-1)


def find_folders():
  return [
      d for d in os.listdir(_GOLDEN_FILES_BASE_PATH)
      if os.path.isdir(os.path.join(_GOLDEN_FILES_BASE_PATH, d))
  ]


def get_all_files(folder, ending):
  all_files = []
  for f in os.walk(folder):
    all_files += glob(os.path.join(f[0], "*" + ending))
  return all_files


def g4(op, txt_files):
  code = subprocess.call(["g4", op] + txt_files)
  if code != 0:
    logging.fatal("Cannot g4 %s", op)
    sys.exit(-1)


def extract_zip(name):
  folder = tempfile.mkdtemp()
  zip_file = zipfile.ZipFile(_PROTO_ZIP_OUTPUT_FILE % name)
  zip_file.extractall(folder)
  return get_all_files(folder, ".java")


def move_extracted(files, name):
  path = _GOLDEN_FILES_BASE_PATH + name + "/"
  moved_files = []
  for f in files:
    file_name = f[f.rfind("/") + 1:]
    to_path = path + file_name + ".txt"
    shutil.move(f, to_path)
    moved_files.append(to_path)

  return moved_files


def remove_old_files(name):
  path = _GOLDEN_FILES_BASE_PATH + name + "/"
  g4("edit", [path + "..."])
  shutil.rmtree(path)
  os.mkdir(path)


def main(argv):
  del argv  # Unused
  ensure_google3_or_die()
  build_proto_zips_or_die()
  proto_names = find_folders()
  for proto_name in proto_names:
    logging.info("Updating %s", proto_name)
    remove_old_files(proto_name)
    extracted_files = extract_zip(proto_name)
    moved_files = move_extracted(extracted_files, proto_name)
    g4("add", moved_files)

  g4("revert", ["-a"])


if __name__ == "__main__":
  app.run(main)
