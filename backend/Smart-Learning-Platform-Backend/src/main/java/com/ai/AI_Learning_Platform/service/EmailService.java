package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.EmailDetails;

public interface EmailService {

    String sendSimpleMail(EmailDetails details);
    String sendMailWithAttachment(EmailDetails details);
}
