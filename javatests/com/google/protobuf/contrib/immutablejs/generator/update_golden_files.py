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
from absl import app
from absl import logging


_BLAZE_TARGET = "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/immutablejs/protos:all"
_GOLDEN_FILES_BASE_PATH = "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/immutablejs/generator/golden_files/"
_PROTO_OUTPUT_FILE = "blaze-bin/third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/immutablejs/protos/%s-improto/"


def ensure_google3_or_die():
  cwd = os.getcwd()
  if not cwd.endswith("/google3"):
    logging.fatal("Run this from a google3 citc client")
    sys.exit(-1)


def build_proto_or_die():
  code = subprocess.call(["blaze", "build", _BLAZE_TARGET])
  if code != 0:
    logging.fatal("Blaze build of protos failed")
    sys.exit(-1)


def find_folders():
  return [
      d for d in os.listdir(_GOLDEN_FILES_BASE_PATH)
      if os.path.isdir(os.path.join(_GOLDEN_FILES_BASE_PATH, d))
  ]


def remove_old_golden_files(proto_name):
  for f in os.listdir(_GOLDEN_FILES_BASE_PATH + proto_name):
    path = os.path.join(_GOLDEN_FILES_BASE_PATH, proto_name, f)
    g4("edit", path)
    os.remove(path)


def copy_new_golden_files(proto_name):
  proto_dir = _PROTO_OUTPUT_FILE % proto_name
  for f in os.listdir(proto_dir):
    src = os.path.join(proto_dir, f)
    dest = os.path.join(_GOLDEN_FILES_BASE_PATH, proto_name, f + ".txt")
    g4("add", dest)
    shutil.copyfile(src, dest)


def g4(op, f):
  code = subprocess.call(["g4", op, f])
  if code != 0:
    logging.fatal("Cannot g4 %s file: %s", op, f)
    sys.exit(-1)


def revert_unchanged_files():
  code = subprocess.call(["g4", "revert", "-a"])
  if code != 0:
    logging.fatal("Cannot revert unchanged files")
    sys.exit(-1)


def main(argv):
  del argv  # Unused
  ensure_google3_or_die()
  build_proto_or_die()
  proto_names = find_folders()
  for proto_name in proto_names:
    logging.info("Updating %s", proto_name)
    remove_old_golden_files(proto_name)
    copy_new_golden_files(proto_name)
  revert_unchanged_files()


if __name__ == "__main__":
  app.run(main)
