package com.ai.AI_Learning_Platform.controller.StudentControllers;
// Importing required classes

import com.ai.AI_Learning_Platform.model.EmailDetails;
import com.ai.AI_Learning_Platform.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Annotation
@RestController
@RequestMapping("/api")
public class EmailController {
    @Autowired
     private EmailService emailService;

    // Sending a simple Email
    @PostMapping("/sendMail")
    public String sendMail(@RequestBody EmailDetails details)
    {
        return emailService.sendSimpleMail(details);
    }

    // Sending email with attachment
    @PostMapping("/sendMailWithAttachment")
    public String sendMailWithAttachment(
            @RequestBody EmailDetails details)
    {

        return emailService.sendMailWithAttachment(details);
    }
}
