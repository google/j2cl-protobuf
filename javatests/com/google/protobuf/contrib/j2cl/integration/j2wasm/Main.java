/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.protobuf.contrib.j2cl.integration.j2wasm;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import com.google.protobuf.contrib.j2cl.protos.AmbiguousNames.MyMessage;
import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Base;
import com.google.protobuf.contrib.j2cl.protos.FieldNames.Fields;
import com.google.protobuf.contrib.j2cl.protos.Maps.MapTestProto;
import com.google.protobuf.contrib.j2cl.protos.Oneofs.TestProtoWithOneOfs;
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto;
import com.google.protobuf.contrib.j2cl.protos.Proto3Oneofs.Proto3TestProtoWithOneOfs;
import com.google.protobuf.contrib.j2cl.protos.Proto3Optional.TestProto3;
import com.google.protobuf.contrib.j2cl.protos.ProtoWithDashes.ProtoWithDashesMessage;
import com.google.protos.EmptyPackage;

public class Main {

  public static void testMain() {
    MapTestProto mapTestProto = MapTestProto.newBuilder().build();
    TestProto testProto = TestProto.newBuilder().build();
    TestProtoWithOneOfs testProtoWithOneOfs = TestProtoWithOneOfs.newBuilder().build();
    MyMessage myMessage = MyMessage.newBuilder().build();
    EnumTestProto enumTestProto = EnumTestProto.newBuilder().build();
    Base base = Base.newBuilder().build();
    EmptyPackage.TestProto testProto1 = EmptyPackage.TestProto.newBuilder().build();
    Fields fields = Fields.newBuilder().build();
    ProtoWithDashesMessage protoWithDashesMessage = ProtoWithDashesMessage.newBuilder().build();
    TestProto3 testProto3 = TestProto3.newBuilder().build();
    Proto3EnumTestProto proto3EnumTestProto = Proto3EnumTestProto.newBuilder().build();
    Proto3TestProtoWithOneOfs proto3TestProtoWithOneOfs =
        Proto3TestProtoWithOneOfs.newBuilder().build();
  }
}
