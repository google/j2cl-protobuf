// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.module('proto.im.internal.InternalMutableMapView');

const MapView = goog.require('proto.im.MapView');

/**
 * A mutable view of a map field.
 *
 * @interface
 * @extends {MapView<KEY, VALUE>}
 * @template KEY, VALUE
 */
class InternalMutableMapView {
  /**
   * @param {KEY} key
   * @param {VALUE} value
   */
  set(key, value) {}

  /**
   * @param {KEY} key
   */
  remove(key) {}
}

exports = InternalMutableMapView;
