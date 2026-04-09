package com.eseict.ssc;//package com.eseict.ssc;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//class SscApplicationTests {
//
//    @Test
//    void contextLoads() {
//    }
//
//}


import org.junit.jupiter.api.Test;

class SscApplicationTests {

    @Test
    void contextLoads() {

        String test = "asd+fdsjhkl+%d/dsa";
        test  = test.replaceAll("[+]","%20");
        System.out.println(test);
    }

}