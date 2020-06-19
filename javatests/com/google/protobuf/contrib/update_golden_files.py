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
import os
import shutil
import subprocess
import sys

from google3.pyglib import app

_TARGET = "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/%s/protos:all"
_GOLDEN_FILES_BASE_PATH = "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/%s/generator/golden_files/"
_PROTO_OUTPUT_BASE_PATH = "blaze-bin/third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/%s/protos/"


def build_protos(targets):
  code = subprocess.call(["blaze", "build"] + targets)
  if code != 0:
    print("Blaze build of protos failed")
    sys.exit(-1)


def find_folders(folder):
  return [
      d for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d))
  ]


def remove_old_files(path):
  g4("rm", [path + "..."])
  shutil.rmtree(path)
  os.mkdir(path)


def get_all_sources(folder):
  all_files = []
  for root, _, files in os.walk(folder):
    all_files += [
        os.path.join(root, f)
        for f in files
        if f.endswith(".java") or f.endswith(".js")
    ]
  return all_files


def move(source, target):
  os.makedirs(target)
  moved_files = []
  for f in get_all_sources(source):
    file_name = f[f.rfind("/") + 1:]
    to_path = os.path.join(target, file_name + ".txt")
    shutil.copyfile(f, to_path)
    moved_files.append(to_path)
  return moved_files


def g4(op, files):
  code = subprocess.call(["g4", op] + files)
  if code != 0:
    print("Cannot g4 %s" % op)
    sys.exit(-1)


def update_goldens(kind, output_postfix):
  golden_base = _GOLDEN_FILES_BASE_PATH % kind
  output_base = _PROTO_OUTPUT_BASE_PATH % kind
  proto_names = find_folders(golden_base)
  remove_old_files(golden_base)
  files = []
  for proto_name in proto_names:
    print("Updating %s" % proto_name)
    output = output_base + proto_name + output_postfix
    golden = golden_base + proto_name
    files += move(output, golden)
  return files


def main(argv):
  del argv

  build_protos([_TARGET % "immutablejs", _TARGET % "j2cl"])

  files = []
  files += update_goldens(kind="immutablejs", output_postfix="-improto")
  files += update_goldens(
      kind="j2cl", output_postfix="_j2cl_proto_for_testing_do_not_use")

  g4("add", files)
  g4("revert", ["-a"])


if __name__ == "__main__":
  app.run(main)
