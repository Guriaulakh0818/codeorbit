package com.codeorbit.service;

import com.codeorbit.dto.SitemapEntryDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.impl.SitemapServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SitemapServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubcourseRepository subcourseRepository;

    @Mock
    private CourseModuleRepository moduleRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private PlacementKitRepository placementKitRepository;

    private SitemapServiceImpl sitemapService;

    @BeforeEach
    void setUp() {
        sitemapService = new SitemapServiceImpl(
                courseRepository,
                subcourseRepository,
                moduleRepository,
                lessonRepository,
                placementKitRepository
        );
    }

    @Test
    @DisplayName("getPublicSitemapEntries includes static pages, published courses, subcourses, modules, free lessons, and placement kits")
    void testGetPublicSitemapEntries() {
        Course course = new Course("Data Structures & Algorithms", "dsa", "Learn DSA", "Short desc", "DSA", "BEGINNER", 40, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        Subcourse subcourse = new Subcourse(course, CurriculumLevel.BEGINNER, "DSA Fundamentals", "dsa-fundamentals", "Desc", 0, true, 1, PublishStatus.PUBLISHED);
        subcourse.setId(10L);

        CourseModule module = new CourseModule(course, "Arrays & Pointers", "arrays-and-pointers", "Desc", 1, PublishStatus.PUBLISHED);
        module.setId(100L);
        module.setSubcourse(subcourse);

        Lesson freeLesson = new Lesson(module, "Dynamic Arrays in C++", "dynamic-arrays-cpp", 15, 1, PublishStatus.PUBLISHED, "English content", "Hinglish content", HinglishStatus.PUBLISHED);
        freeLesson.setId(1000L);

        PlacementKit kit = new PlacementKit("sde1-fullstack-kit", "SDE 1 Full Stack Interview Kit", "SDE 1", "Short desc", "Full desc", 1);
        kit.setId(500L);

        when(courseRepository.findByStatusOrderByOrderIndexAsc(PublishStatus.PUBLISHED)).thenReturn(List.of(course));
        when(subcourseRepository.findByCourseIdAndStatusOrderByOrderIndexAsc(1L, PublishStatus.PUBLISHED)).thenReturn(List.of(subcourse));
        when(moduleRepository.findBySubcourseIdAndStatusOrderByOrderIndexAsc(10L, PublishStatus.PUBLISHED)).thenReturn(List.of(module));
        when(lessonRepository.findByModuleIdAndStatusOrderByOrderIndexAsc(100L, PublishStatus.PUBLISHED)).thenReturn(List.of(freeLesson));
        when(placementKitRepository.findByActiveTrueOrderByOrderIndexAsc()).thenReturn(List.of(kit));

        List<SitemapEntryDto> entries = sitemapService.getPublicSitemapEntries();

        assertNotNull(entries);
        assertFalse(entries.isEmpty());

        // Check static URLs
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/")));
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/about")));
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/courses")));
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/privacy")));
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/placement-kits")));

        // Check Course URL
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/courses/dsa")));

        // Check Subcourse URL
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/courses/dsa/dsa-fundamentals")));

        // Check Module URL
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/courses/dsa/dsa-fundamentals/arrays-and-pointers")));

        // Check Hierarchical Lesson URL
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/courses/dsa/dsa-fundamentals/arrays-and-pointers/dynamic-arrays-cpp")));

        // Check Placement Kit URL
        assertTrue(entries.stream().anyMatch(e -> e.getLoc().equals("https://www.codeorbit.online/placement-kits/sde1-fullstack-kit")));

        // Verify private routes are NOT in sitemap
        assertFalse(entries.stream().anyMatch(e -> e.getLoc().contains("/student/")));
        assertFalse(entries.stream().anyMatch(e -> e.getLoc().contains("/admin/")));
        assertFalse(entries.stream().anyMatch(e -> e.getLoc().contains("/login")));
    }

    @Test
    @DisplayName("generateSitemapXml produces valid UTF-8 XML document with urlset schema")
    void testGenerateSitemapXml() {
        when(courseRepository.findByStatusOrderByOrderIndexAsc(PublishStatus.PUBLISHED)).thenReturn(List.of());
        when(placementKitRepository.findByActiveTrueOrderByOrderIndexAsc()).thenReturn(List.of());

        String xml = sitemapService.generateSitemapXml();

        assertNotNull(xml);
        assertTrue(xml.startsWith("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"));
        assertTrue(xml.contains("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"));
        assertTrue(xml.contains("<loc>https://www.codeorbit.online/</loc>"));
        assertTrue(xml.contains("</urlset>"));
    }
}
