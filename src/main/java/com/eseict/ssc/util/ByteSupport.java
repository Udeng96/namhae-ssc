package com.eseict.ssc.util;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class ByteSupport {


    public static byte[] intToByteArray(int val, ByteOrder bo) {
        ByteBuffer buff = ByteBuffer.allocate(4);
        buff.order(bo);
        buff.putInt(val);
        return buff.array();
    }

    public static int byteArrayToInt(byte[] bytes, ByteOrder bo) throws Exception {
        if (bytes.length != 4) {
            throw new Exception("Invalid byte array size");
        } else {
            ByteBuffer buff = ByteBuffer.allocate(4);
            buff.order(bo);
            buff.put(bytes);
            buff.flip();
            return buff.getInt();
        }
    }

    public static int byteArrayToInt(byte[] bytes) throws Exception {
        return byteArrayToInt(bytes, ByteOrder.BIG_ENDIAN);
    }
}
