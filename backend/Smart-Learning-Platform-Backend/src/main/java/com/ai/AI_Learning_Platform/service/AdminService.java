package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.Admin;
import com.ai.AI_Learning_Platform.model.Role;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.AdminRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userRepository;

    public static int generateOtp() {
        SecureRandom random = new SecureRandom();
        return 100000 + random.nextInt(900000);
    }

    public User findAdmin(String email){
//        System.out.println(email + " check");

        User admin1 = null;
        List<User> admins = userRepository.findAll();
        for(var adminTemp: admins){
//            System.out.println(adminTemp.getEmail() + " in loop");
            if(adminTemp.getEmail().trim().equals(email.trim())){
                admin1 = adminTemp;
                break;
            }
        }
        return admin1;
    }
    public User loginAsAdmin(User admin, HttpSession session){
//        System.out.println(adminRepository.findAll().size() + " size");
//        System.out.println("in function");
        User admin1 = findAdmin(admin.getEmail());
//        System.out.println(admin1 );
        if(admin1 == null) return null;
//        System.out.println(admin1 + " admin is found");
//        System.out.println(admin1.getRole() + " " + admin1.getPassword());

        if( (admin1.getRole() != Role.ADMIN) || (!bCryptPasswordEncoder.matches(admin.getPassword(), admin1.getPassword())) ) return null;
//        System.out.println("found ");
        Object obj = session.getAttribute("user");
        if(obj != null){
            session.removeAttribute("user");
        }
        session.setAttribute("user",admin1);
        return admin1;
    }

    public int GenerateOTPAndSave(Admin admin) {
        if (admin == null) {
            return 0;
        }
        int otp = generateOtp();

        while (adminRepository.findByOtp(otp) != null) {
            otp = generateOtp();
        }

        admin.setOtp(otp);
        adminRepository.save(admin);
        return otp;
    }

    public Admin checkOtp(Admin  admin){
        return adminRepository.findByOtp(admin.getOtp());
    }

    public Admin saveAdmin(Admin admin){
        admin.setPassword(bCryptPasswordEncoder.encode(admin.getPassword()) );
        return adminRepository.save(admin);
    }
}
