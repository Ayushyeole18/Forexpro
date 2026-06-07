package com.forexpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ForexproApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForexproApplication.class, args);
    }

}