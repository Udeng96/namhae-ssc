package com.eseict.ssc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.r2dbc.R2dbcAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication(scanBasePackages = "com.eseict.ssc", exclude = {R2dbcAutoConfiguration.class})
public class SscApplication {

    public static void main(String[] args) {
        SpringApplication.run(SscApplication.class, args);
    }

}
