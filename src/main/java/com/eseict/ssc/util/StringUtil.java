package com.eseict.ssc.util;

import com.google.common.base.Strings;

public class StringUtil {

    public static final int PAD_LEFT = 0;
    public static final int PAD_RIGHT = 1;


    public static String setPad(String str, int len, char padChar, int padFlag) {
        String result = "";
        try {
            if (padFlag == 0) {
                result = Strings.padStart(str, len, padChar);
            } else {
                if (padFlag != 1) {
                    throw new Exception("Invalid Padding Option");
                }
                result = Strings.padEnd(str, len, padChar);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
