package com.ai.AI_Learning_Platform.ServicesImplemetations;

import com.ai.AI_Learning_Platform.model.EmailDetails;
import com.ai.AI_Learning_Platform.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") private String sender;

    // Method 1
    // To send a simple email
    public String sendSimpleMail(EmailDetails details)
    {

//        System.out.println("in mail");
        // Try block to check for exceptions
        try {

            // Creating a simple mail message
            MimeMessage mailMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mailMessage, "utf-8");
            helper.setFrom(sender);
            helper.setSubject(details.getSubject());
            helper.setTo(details.getRecipient());
            helper.setText(details.getMsgBody(), true);

            // Sending the mail
            javaMailSender.send(mailMessage);
//            System.out.println ("mail sent" );
            return "Mail Sent Successfully...";
        }

        // Catch block to handle the exceptions
        catch (Exception e) {
//            System.out.println (e );
            return "Error while Sending Mail";
        }
    }

    // Method 2
    // To send an email with attachment
    @Override
    public String sendMailWithAttachment(EmailDetails details)
    {
//        System.out.println (details );
        // Creating a mime message
        MimeMessage mimeMessage
                = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;

        try {

            // Setting multipart as true for attachments to
            // be send
            mimeMessageHelper
                    = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(details.getRecipient());
            mimeMessageHelper.setText(details.getMsgBody());
            mimeMessageHelper.setSubject(
                    details.getSubject());

            // Adding the attachment
            FileSystemResource file
                    = new FileSystemResource(
                    new File(details.getAttachment()));

            mimeMessageHelper.addAttachment(
                    file.getFilename(), file);

            // Sending the mail
            javaMailSender.send(mimeMessage);
//            System.out.println (("mail sent") );
            return "Mail sent Successfully";
        }

        // Catch block to handle MessagingException
        catch (MessagingException e) {
//            System.out.println (e );

            // Display message when exception occurred
            return "Error while sending mail!!!";
        }
    }
}
