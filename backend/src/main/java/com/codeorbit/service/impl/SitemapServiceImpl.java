package com.codeorbit.service.impl;

import com.codeorbit.dto.SitemapEntryDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.SitemapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class SitemapServiceImpl implements SitemapService {

    private static final Logger log = LoggerFactory.getLogger(SitemapServiceImpl.class);
    private static final String BASE_URL = "https://www.codeorbit.online";

    private final CourseRepository courseRepository;
    private final SubcourseRepository subcourseRepository;
    private final CourseModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final PlacementKitRepository placementKitRepository;

    public SitemapServiceImpl(
            CourseRepository courseRepository,
            SubcourseRepository subcourseRepository,
            CourseModuleRepository moduleRepository,
            LessonRepository lessonRepository,
            PlacementKitRepository placementKitRepository
    ) {
        this.courseRepository = courseRepository;
        this.subcourseRepository = subcourseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.placementKitRepository = placementKitRepository;
    }

    @Override
    public List<SitemapEntryDto> getPublicSitemapEntries() {
        List<SitemapEntryDto> entries = new ArrayList<>();

        // 1. Core Static & Trust Pages
        entries.add(new SitemapEntryDto(BASE_URL + "/", "daily", 1.0));
        entries.add(new SitemapEntryDto(BASE_URL + "/courses", "daily", 0.9));
        entries.add(new SitemapEntryDto(BASE_URL + "/placement-kits", "daily", 0.9));
        entries.add(new SitemapEntryDto(BASE_URL + "/certificates/verify", "weekly", 0.7));
        entries.add(new SitemapEntryDto(BASE_URL + "/about", "monthly", 0.5));
        entries.add(new SitemapEntryDto(BASE_URL + "/contact", "monthly", 0.5));
        entries.add(new SitemapEntryDto(BASE_URL + "/privacy", "monthly", 0.4));
        entries.add(new SitemapEntryDto(BASE_URL + "/terms", "monthly", 0.4));
        entries.add(new SitemapEntryDto(BASE_URL + "/refund", "monthly", 0.4));

        // 2. Published Courses (Subjects)
        List<Course> courses = courseRepository.findByStatusOrderByOrderIndexAsc(PublishStatus.PUBLISHED);
        for (Course course : courses) {
            String courseUrl = BASE_URL + "/courses/" + course.getSlug();
            String lastmod = course.getUpdatedAt() != null
                    ? course.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE)
                    : null;
            entries.add(new SitemapEntryDto(courseUrl, "weekly", 0.8, lastmod));

            // 3. Subcourses under Course
            List<Subcourse> subcourses = subcourseRepository.findByCourseIdAndStatusOrderByOrderIndexAsc(
                    course.getId(), PublishStatus.PUBLISHED);
            for (Subcourse sub : subcourses) {
                String subUrl = BASE_URL + "/courses/" + course.getSlug() + "/" + sub.getSlug();
                entries.add(new SitemapEntryDto(subUrl, "weekly", 0.8));

                // 4. Modules under Subcourse
                List<CourseModule> modules = moduleRepository.findBySubcourseIdAndStatusOrderByOrderIndexAsc(
                        sub.getId(), PublishStatus.PUBLISHED);
                for (CourseModule mod : modules) {
                    String modUrl = subUrl + "/" + mod.getSlug();
                    entries.add(new SitemapEntryDto(modUrl, "weekly", 0.7));

                    // 5. Free Lessons under Module
                    if (sub.getCurriculumLevel() != CurriculumLevel.PLACEMENT_READY) {
                        List<Lesson> lessons = lessonRepository.findByModuleIdAndStatusOrderByOrderIndexAsc(
                                mod.getId(), PublishStatus.PUBLISHED);
                        for (Lesson lesson : lessons) {
                            String lessonHierarchicalUrl = modUrl + "/" + lesson.getSlug();
                            entries.add(new SitemapEntryDto(lessonHierarchicalUrl, "weekly", 0.7));
                        }
                    }
                }
            }
        }

        // 6. Active Placement Preparation Kits
        List<PlacementKit> kits = placementKitRepository.findByActiveTrueOrderByOrderIndexAsc();
        for (PlacementKit kit : kits) {
            String kitUrl = BASE_URL + "/placement-kits/" + kit.getSlug();
            entries.add(new SitemapEntryDto(kitUrl, "weekly", 0.8));
        }

        log.info("Generated {} public sitemap entries for search crawlers", entries.size());
        return entries;
    }

    @Override
    public String generateSitemapXml() {
        List<SitemapEntryDto> entries = getPublicSitemapEntries();
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        for (SitemapEntryDto entry : entries) {
            sb.append("  <url>\n");
            sb.append("    <loc>").append(escapeXml(entry.getLoc())).append("</loc>\n");
            if (entry.getLastmod() != null && !entry.getLastmod().isBlank()) {
                sb.append("    <lastmod>").append(escapeXml(entry.getLastmod())).append("</lastmod>\n");
            }
            if (entry.getChangefreq() != null && !entry.getChangefreq().isBlank()) {
                sb.append("    <changefreq>").append(escapeXml(entry.getChangefreq())).append("</changefreq>\n");
            }
            sb.append("    <priority>").append(String.format(java.util.Locale.US, "%.1f", entry.getPriority())).append("</priority>\n");
            sb.append("  </url>\n");
        }

        sb.append("</urlset>\n");
        return sb.toString();
    }

    private String escapeXml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
