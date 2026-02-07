package com.tcsion.backend.service;

import com.tcsion.backend.dto.request.LoginRequest;
import com.tcsion.backend.dto.request.RegisterRequest;
import com.tcsion.backend.dto.response.JwtResponse;
import com.tcsion.backend.entity.User;
import com.tcsion.backend.exception.BadRequestException;
import com.tcsion.backend.repository.UserRepository;
import com.tcsion.backend.security.CustomUserDetails;
import com.tcsion.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .build();

        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user.getEmail());
        return new JwtResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = tokenProvider.generateToken(authentication);

        return new JwtResponse(token, userDetails.getId(), userDetails.getName(), userDetails.getUsername());
    }
}
