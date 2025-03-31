package com.ai.AI_Learning_Platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication(scanBasePackages = "com.ai.AI_Learning_Platform",exclude = {
		org.springframework.cloud.function.context.config.ContextFunctionCatalogAutoConfiguration.class,
})
@EnableAspectJAutoProxy
public class AiLearningPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiLearningPlatformApplication.class, args);
	}

}
