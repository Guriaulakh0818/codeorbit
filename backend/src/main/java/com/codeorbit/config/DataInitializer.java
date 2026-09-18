package com.codeorbit.config;

import com.codeorbit.entity.Ebook;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Development seed mechanism to populate initial sample e-books and bootstrap Admin account.
 */
@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final EbookRepository ebookRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${codeorbit.seed-demo-data:true}")
    private boolean seedDemoData;

    @Value("${app.admin.bootstrap.email:admin@codeorbit.dev}")
    private String adminEmail;

    @Value("${app.admin.bootstrap.password:Admin@CodeOrbit2026!}")
    private String adminPassword;

    @Value("${app.admin.bootstrap.name:CodeOrbit Store Admin}")
    private String adminName;

    public DataInitializer(
            EbookRepository ebookRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.ebookRepository = ebookRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        bootstrapAdminUser();
        seedSampleEbooks();
    }

    private void bootstrapAdminUser() {
        if (userRepository.countByRole(Role.ADMIN) == 0) {
            logger.info("No Admin account found. Bootstrapping default Store Admin: {}", adminEmail);
            User admin = new User(
                    adminName,
                    adminEmail.trim().toLowerCase(),
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN
            );
            userRepository.save(admin);
            logger.info("Default Store Admin account successfully created ({})", adminEmail);
        }
    }

    private void seedSampleEbooks() {
        if (!seedDemoData) {
            logger.info("Demo data seeding is disabled (codeorbit.seed-demo-data=false). Skipping.");
            return;
        }

        if (ebookRepository.count() > 0) {
            logger.info("Database already contains e-books (count={}). Skipping demo seed.", ebookRepository.count());
            return;
        }


        logger.info("Seeding initial sample CSE & IT e-books for local development...");

        List<Ebook> sampleEbooks = List.of(
                new Ebook(
                        "Core Java for Technical Interviews [SAMPLE DEMO]",
                        "Prof. Rahul Sharma",
                        "Java",
                        "Comprehensive master guide covering OOPs principles, Collections framework, JVM internals, Multithreading, and 150+ solved interview coding questions.",
                        new BigDecimal("499.00"),
                        340,
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Python for Data Structures & Automation [SAMPLE DEMO]",
                        "Ananya Verma",
                        "Python",
                        "Hands-on Python guide for CSE students. Covers lists, dicts, OOP in Python, file handling, script automation, and leetcode style coding problems.",
                        new BigDecimal("399.00"),
                        280,
                        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Data Structures & Algorithms in C++ [SAMPLE DEMO]",
                        "Vikramaditya Roy",
                        "DSA",
                        "From Arrays, Linked Lists, Stacks, Queues, Trees, Graphs to Dynamic Programming. Step-by-step visualizations and time-complexity breakdowns.",
                        new BigDecimal("599.00"),
                        450,
                        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Full Stack Web Development with React & Spring Boot [SAMPLE DEMO]",
                        "Siddharth Patel",
                        "Web Development",
                        "End-to-end full stack architecture handbook. React 18 frontend, REST API design, Spring Security stateless JWTs, and MySQL database integration.",
                        new BigDecimal("649.00"),
                        390,
                        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Database Management Systems & Advanced SQL [SAMPLE DEMO]",
                        "Dr. Priya Nambiar",
                        "DBMS",
                        "Master ER diagrams, normalization (1NF to BCNF), indexing, transactions & ACID properties, and 100+ complex SQL query solutions.",
                        new BigDecimal("449.00"),
                        310,
                        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Operating Systems: Concepts and Interview Prep [SAMPLE DEMO]",
                        "Karan Malhotra",
                        "Operating Systems",
                        "Concise engineering handbook covering Process Synchronization, Deadlocks, Memory Management, Paging, Virtual Memory, and Scheduling algorithms.",
                        new BigDecimal("399.00"),
                        260,
                        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Computer Networks: From OSI to HTTP/3 [SAMPLE DEMO]",
                        "Neha Gupta",
                        "Computer Networks",
                        "Practical networking principles: OSI vs TCP/IP models, IP addressing & subnetting, routing protocols, DNS, TCP handshakes, TLS, and HTTP/3.",
                        new BigDecimal("429.00"),
                        295,
                        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Cracking the CSE Campus Placements Handbook [SAMPLE DEMO]",
                        "CodeOrbit Editorial Board",
                        "Interview Preparation",
                        "Ultimate cheat sheet: 50 DSA patterns, Top 100 OS/DBMS/CN MCQs, HR interview frameworks, and resume templates for top product companies.",
                        new BigDecimal("549.00"),
                        380,
                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
                        true
                )
        );

        ebookRepository.saveAll(sampleEbooks);
        logger.info("Successfully seeded {} sample e-books into database.", sampleEbooks.size());
    }
}
