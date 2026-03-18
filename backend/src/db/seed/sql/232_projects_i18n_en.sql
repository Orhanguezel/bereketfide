-- =============================================================
-- 232_projects_i18n_en.sql
-- Bereket Fide proje i18n kayıtları — ENGLISH (en)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

INSERT INTO `projects_i18n`
(
  id, project_id, locale,
  title, slug, summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
VALUES

-- 1. Bosphorus View Residence — Istanbul, Beşiktaş
(
  '55555001-0001-4555-8555-555500000001',
  '33333001-0001-4333-8333-333300000001',
  'en',
  'Bosphorus View Residence — 18 Units, 6 Floors',
  'bosphorus-view-residence-besiktas',
  'A luxury 18-unit, 6-storey residence with Bosphorus views was successfully completed in Beşiktaş, Istanbul.',
  '{"html":"<p>In Beşiktaş, one of Istanbul''s most prestigious districts, an <strong>18-unit, 6-storey luxury residence</strong> with stunning Bosphorus views was delivered by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Istanbul, Beşiktaş — Bosphorus waterfront</li><li>Type: Luxury Residence</li><li>Units: 18</li><li>Floors: 6</li><li>Completed: March 2024</li></ul><h3>Design & Construction</h3><p>The project features a reinforced concrete structural system, energy-efficient curtain wall glazing, smart home systems, and bespoke landscaping. Every apartment offers spacious balconies and terraces maximising the Bosphorus panorama.</p>","description":"18-unit, 6-storey luxury residence with Bosphorus views in Beşiktaş — Bereket Fide residential project."}',
  'Bosphorus View Residence — Bereket Fide Beşiktaş Luxury Residential',
  'Bosphorus View Residence Beşiktaş — Bereket Fide',
  'Luxury 18-unit, 6-storey residence with Bosphorus views in Beşiktaş, Istanbul. Bereket Fide residential reference.',
  NOW(3), NOW(3)
),

-- 2. Levent Office Tower — Istanbul, Levent
(
  '55555001-0002-4555-8555-555500000002',
  '33333001-0002-4333-8333-333300000002',
  'en',
  'Levent Office Tower — 12-Storey LEED-Certified Class A Office',
  'levent-office-tower-leed-certified',
  'A 12-storey LEED-certified Class A office tower with steel structure and curtain wall was completed in Levent, Istanbul.',
  '{"html":"<p>In Levent, Istanbul''s financial hub, a <strong>12-storey LEED-certified Class A office tower</strong> was constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Istanbul, Levent</li><li>Type: Class A Office Tower</li><li>Floors: 12</li><li>Structure: Steel frame + curtain wall</li><li>Certification: LEED Green Building</li></ul><h3>Sustainable Design</h3><p>The building was designed with an energy-efficiency focus, featuring high-performance curtain wall glazing, rainwater harvesting, and an intelligent building management system, earning LEED green building certification.</p>","description":"12-storey LEED-certified steel-frame Class A office tower in Levent — Bereket Fide commercial project."}',
  'Levent Office Tower — Bereket Fide LEED-Certified Commercial Project',
  'Levent Office Tower LEED Certified — Bereket Fide',
  '12-storey LEED-certified Class A office tower with steel structure and curtain wall in Levent, Istanbul. Bereket Fide commercial reference.',
  NOW(3), NOW(3)
),

-- 3. Kadıköy Mixed-Use Complex — Istanbul, Kadıköy
(
  '55555001-0003-4555-8555-555500000003',
  '33333001-0003-4333-8333-333300000003',
  'en',
  'Kadıköy Mixed-Use Complex — 64 Residences + 3 Commercial Floors',
  'kadikoy-mixed-use-complex',
  'A mixed-use complex comprising 64 residential units and 3 floors of commercial space is under construction in Kadıköy, Istanbul.',
  '{"html":"<p>In central Kadıköy, Istanbul, a <strong>mixed-use complex with 64 residential units and 3 commercial floors</strong> is being constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Istanbul, Kadıköy</li><li>Type: Mixed-Use (Residential + Commercial)</li><li>Residential: 64 units</li><li>Commercial: 3 floors of retail and office space</li><li>Parking: 2-level underground car park</li></ul><h3>Urban Living</h3><p>The project is designed with modern architectural lines that complement Kadıköy''s vibrant urban fabric. Ground and upper levels feature commercial spaces, while the upper floors house a variety of residential unit types.</p>","description":"64-unit residential + 3-floor commercial mixed-use complex in Kadıköy — Bereket Fide ongoing project."}',
  'Kadıköy Mixed-Use Complex — Bereket Fide Residential & Commercial',
  'Kadıköy Mixed-Use Complex — Bereket Fide',
  'Mixed-use complex with 64 residences and 3 commercial floors in Kadıköy, Istanbul. Bereket Fide reference.',
  NOW(3), NOW(3)
),

-- 4. Historic Han Restoration — Istanbul, Eminönü
(
  '55555001-0004-4555-8555-555500000004',
  '33333001-0004-4333-8333-333300000004',
  'en',
  'Historic Han Restoration — 19th-Century Ottoman Caravanserai',
  'historic-han-restoration-eminonu',
  'A comprehensive restoration of a 19th-century Ottoman caravanserai (han) was completed in Eminönü, Istanbul.',
  '{"html":"<p>In Istanbul''s historic peninsula at Eminönü, a <strong>19th-century Ottoman caravanserai</strong> underwent comprehensive restoration by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Istanbul, Eminönü</li><li>Type: Historic Building Restoration</li><li>Period: 19th-century Ottoman</li><li>Duration: March 2020 – August 2022</li></ul><h3>Restoration Scope</h3><p>The original stone masonry was preserved and structurally reinforced. Timber roof and floor elements were restored, and historic window and door joinery was repaired. All works were carried out under Conservation Board supervision using authentic materials and traditional techniques.</p>","description":"19th-century Ottoman caravanserai restoration in Eminönü — stonework, timber repair and reinforcement. Bereket Fide."}',
  'Historic Han Restoration Eminönü — Bereket Fide Heritage Project',
  'Historic Han Restoration Eminönü — Bereket Fide',
  'Comprehensive restoration of a 19th-century Ottoman caravanserai in Eminönü, Istanbul. Stone and timber restoration. Bereket Fide heritage reference.',
  NOW(3), NOW(3)
),

-- 5. Gebze Logistics Centre — Kocaeli, Gebze
(
  '55555001-0005-4555-8555-555500000005',
  '33333001-0005-4333-8333-333300000005',
  'en',
  'Gebze Logistics Centre — 8,000 m² Prefabricated Steel Warehouse',
  'gebze-logistics-centre-prefabricated-steel',
  'An 8,000 m² prefabricated steel logistics warehouse was completed in Gebze, Kocaeli.',
  '{"html":"<p>In Gebze, Kocaeli, an <strong>8,000 m² prefabricated steel logistics warehouse</strong> was constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Kocaeli, Gebze</li><li>Type: Logistics Warehouse</li><li>Covered area: 8,000 m²</li><li>Structure: Prefabricated steel</li><li>Completed: June 2024</li></ul><h3>Industrial Construction</h3><p>The facility features a steel structure designed for heavy-duty crane loads, ground improvement works, and modern loading docks. A wide-span, column-free layout was implemented to optimise logistics operations.</p>","description":"8,000 m² prefabricated steel logistics warehouse in Gebze — Bereket Fide industrial project."}',
  'Gebze Logistics Centre — Bereket Fide Industrial Project',
  'Gebze Logistics Centre Prefabricated Steel — Bereket Fide',
  '8,000 m² prefabricated steel logistics warehouse in Gebze, Kocaeli. Bereket Fide industrial construction reference.',
  NOW(3), NOW(3)
),

-- 6. Beşiktaş Waterfront Residence — Istanbul, Beşiktaş
(
  '55555001-0006-4555-8555-555500000006',
  '33333001-0006-4333-8333-333300000006',
  'en',
  'Beşiktaş Waterfront Residence — 24-Unit Modern Residential',
  'besiktas-waterfront-residence-modern',
  'A 24-unit modern waterfront residence is under construction along the Beşiktaş shoreline in Istanbul.',
  '{"html":"<p>Along the Beşiktaş waterfront in Istanbul, a <strong>24-unit modern residence</strong> is being constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Istanbul, Beşiktaş — waterfront</li><li>Type: Modern Residence</li><li>Units: 24</li><li>Started: March 2024</li></ul><h3>Modern Living</h3><p>The project combines waterfront views with city access, featuring façade cladding, landscape design, and swimming pool construction as part of the comprehensive building programme.</p>","description":"24-unit modern waterfront residence in Beşiktaş — Bereket Fide ongoing residential project."}',
  'Beşiktaş Waterfront Residence — Bereket Fide Modern Residential',
  'Beşiktaş Waterfront Residence 24 Units — Bereket Fide',
  '24-unit modern waterfront residence in Beşiktaş, Istanbul. Bereket Fide residential reference.',
  NOW(3), NOW(3)
),

-- 7. Ankara Government Services Building — Ankara, Çankaya
(
  '55555001-0007-4555-8555-555500000007',
  '33333001-0007-4333-8333-333300000007',
  'en',
  'Ankara Government Services Building — 7-Storey Ministry Building',
  'ankara-government-services-building',
  'A 7-storey government ministry building including seismic reinforcement was completed in Çankaya, Ankara.',
  '{"html":"<p>In Çankaya, Ankara''s administrative centre, a <strong>7-storey ministry services building</strong> was constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Ankara, Çankaya</li><li>Type: Government Services Building</li><li>Floors: 7</li><li>Duration: May 2021 – October 2023</li></ul><h3>Public Sector Expertise</h3><p>The project encompassed reinforced concrete structural works, curtain wall glazing, seismic reinforcement, and full mechanical services installation. The building was designed and built in compliance with current seismic regulations.</p>","description":"7-storey government ministry building with seismic reinforcement in Çankaya, Ankara — Bereket Fide public sector project."}',
  'Ankara Government Services Building — Bereket Fide Public Sector',
  'Ankara Government Services Building — Bereket Fide',
  '7-storey government ministry building with seismic reinforcement in Çankaya, Ankara. Bereket Fide public sector reference.',
  NOW(3), NOW(3)
),

-- 8. Bursa Industrial Zone Infrastructure — Bursa, Nilüfer
(
  '55555001-0008-4555-8555-555500000008',
  '33333001-0008-4333-8333-333300000008',
  'en',
  'Bursa OIZ Infrastructure Renewal — 45,000 m² Site Development',
  'bursa-oiz-infrastructure-renewal',
  'A 45,000 m² infrastructure renewal and site development project was completed at an organised industrial zone in Nilüfer, Bursa.',
  '{"html":"<p>At an organised industrial zone (OIZ) in Nilüfer, Bursa, a <strong>45,000 m² infrastructure renewal and site development</strong> project was delivered by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Bursa, Nilüfer OIZ</li><li>Type: Infrastructure Renewal</li><li>Area: 45,000 m²</li><li>Duration: April 2023 – September 2024</li></ul><h3>Infrastructure Scope</h3><p>Comprehensive works included road construction, sewerage lines, stormwater drainage systems, and landscape development across the industrial zone.</p>","description":"45,000 m² infrastructure renewal and site development at Bursa Nilüfer OIZ — Bereket Fide infrastructure project."}',
  'Bursa OIZ Infrastructure Renewal — Bereket Fide Infrastructure Project',
  'Bursa OIZ Infrastructure Renewal 45,000 m² — Bereket Fide',
  '45,000 m² infrastructure renewal and site development at Bursa Nilüfer organised industrial zone. Bereket Fide infrastructure reference.',
  NOW(3), NOW(3)
),

-- 9. Antalya Boutique Hotel — Antalya, Kaleiçi
(
  '55555001-0009-4555-8555-555500000009',
  '33333001-0009-4333-8333-333300000009',
  'en',
  'Antalya Kaleiçi Boutique Hotel — 32 Rooms, Historic District',
  'antalya-kaleici-boutique-hotel-historic',
  'A 32-room boutique hotel harmonising with the historic fabric is under construction in Kaleiçi, Antalya.',
  '{"html":"<p>In Kaleiçi, the historic heart of Antalya, a <strong>32-room boutique hotel</strong> is being constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Antalya, Kaleiçi</li><li>Type: Boutique Hotel</li><li>Rooms: 32</li><li>Started: June 2024</li></ul><h3>Historic Fabric Harmony</h3><p>In keeping with Kaleiçi''s UNESCO World Heritage–listed historic fabric, stone masonry and timber craftsmanship take centre stage. Traditional Antalya architecture is blended with modern comfort standards.</p>","description":"32-room boutique hotel in historic Kaleiçi, Antalya — stone and timber. Bereket Fide hospitality project."}',
  'Antalya Kaleiçi Boutique Hotel — Bereket Fide Hospitality Project',
  'Antalya Kaleiçi Boutique Hotel 32 Rooms — Bereket Fide',
  '32-room boutique hotel in historic Kaleiçi, Antalya. Stone masonry and timber craftsmanship. Bereket Fide hospitality reference.',
  NOW(3), NOW(3)
),

-- 10. İzmir Technology Campus — İzmir, Bayraklı
(
  '55555001-0010-4555-8555-555500000010',
  '33333001-0010-4333-8333-333300000010',
  'en',
  'İzmir Technology Campus — 32,000 m² Sustainable Office Campus',
  'izmir-technology-campus-sustainable-office',
  'A 32,000 m² sustainable technology office campus was completed in Bayraklı, İzmir.',
  '{"html":"<p>In Bayraklı, İzmir''s emerging business district, a <strong>32,000 m² sustainable technology office campus</strong> was constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: İzmir, Bayraklı</li><li>Type: Technology Office Campus</li><li>Covered area: 32,000 m²</li><li>Duration: October 2022 – November 2024</li></ul><h3>Sustainable Design</h3><p>Built with a steel frame and curtain wall system, the campus features solar panels, green roof applications, and an energy-efficient HVAC system meeting sustainable building standards. Landscape design creates a comfortable working environment for tech professionals.</p>","description":"32,000 m² sustainable technology office campus in Bayraklı, İzmir — Bereket Fide commercial project."}',
  'İzmir Technology Campus — Bereket Fide Sustainable Project',
  'İzmir Technology Campus Bayraklı — Bereket Fide',
  '32,000 m² sustainable technology office campus in Bayraklı, İzmir. Steel frame and curtain wall. Bereket Fide commercial reference.',
  NOW(3), NOW(3)
),

-- 11. Ümraniye Housing Project — Istanbul, Ümraniye
(
  '55555001-0011-4555-8555-555500000011',
  '33333001-0011-4333-8333-333300000011',
  'en',
  'Ümraniye Mass Housing — 120-Unit Residential with Social Facilities',
  'umraniye-mass-housing-120-units',
  'A 120-unit mass housing project with social facilities and parking was completed in Ümraniye, Istanbul.',
  '{"html":"<p>In Ümraniye, Istanbul, a <strong>120-unit mass housing project</strong> was constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Istanbul, Ümraniye</li><li>Type: Mass Housing</li><li>Units: 120</li><li>Duration: January 2021 – June 2023</li></ul><h3>Comprehensive Living</h3><p>In addition to 120 residential units, the project includes landscape development, an underground car park, and social facilities. Various apartment types cater to diverse family needs.</p>","description":"120-unit mass housing with parking and social facilities in Ümraniye — Bereket Fide residential project."}',
  'Ümraniye Mass Housing 120 Units — Bereket Fide Residential',
  'Ümraniye Mass Housing 120 Units — Bereket Fide',
  '120-unit mass housing project with social facilities and parking in Ümraniye, Istanbul. Bereket Fide residential reference.',
  NOW(3), NOW(3)
),

-- 12. Taksim Hotel Renovation — Istanbul, Beyoğlu
(
  '55555001-0012-4555-8555-555500000012',
  '33333001-0012-4333-8333-333300000012',
  'en',
  'Taksim Hotel Renovation — 85-Room Full Refurbishment',
  'taksim-hotel-renovation-85-rooms',
  'A comprehensive renovation of an 85-room hotel was completed in Taksim, Beyoğlu, Istanbul.',
  '{"html":"<p>In Taksim, Istanbul''s tourism hub, a <strong>comprehensive renovation of an 85-room hotel</strong> was carried out by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Istanbul, Beyoğlu — Taksim</li><li>Type: Hotel Renovation</li><li>Rooms: 85</li><li>Duration: November 2022 – February 2024</li></ul><h3>Renovation Scope</h3><p>The full refurbishment included interior fitout, mechanical and electrical services replacement, façade renewal, and redesign of the lobby and restaurant areas. The hotel remained partially operational throughout the renovation.</p>","description":"85-room hotel renovation in Taksim — interior, façade and MEP renewal. Bereket Fide hospitality project."}',
  'Taksim Hotel Renovation — Bereket Fide Hospitality Project',
  'Taksim Hotel Renovation 85 Rooms — Bereket Fide',
  'Comprehensive 85-room hotel renovation in Taksim, Istanbul. Interior, façade and services renewal. Bereket Fide hospitality reference.',
  NOW(3), NOW(3)
),

-- 13. Eskişehir University Campus — Eskişehir
(
  '55555001-0013-4555-8555-555500000013',
  '33333001-0013-4333-8333-333300000013',
  'en',
  'Eskişehir University Campus Extension — 15,000 m² Education Building',
  'eskisehir-university-campus-extension',
  'A 15,000 m² education building extension was completed at a university campus in Eskişehir.',
  '{"html":"<p>At a university campus in Eskişehir, a <strong>15,000 m² education building extension</strong> was constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Eskişehir</li><li>Type: Education Building — Campus Extension</li><li>Covered area: 15,000 m²</li><li>Duration: August 2020 – January 2023</li></ul><h3>Educational Infrastructure</h3><p>The building houses laboratories, lecture halls, a library, and office spaces. A reinforced concrete structural system and modern façade design maintain architectural continuity with the existing campus buildings.</p>","description":"15,000 m² university campus extension in Eskişehir — labs, lecture halls, library. Bereket Fide public sector project."}',
  'Eskişehir University Campus Extension — Bereket Fide Education Project',
  'Eskişehir University Campus Extension — Bereket Fide',
  '15,000 m² university campus education building in Eskişehir. Laboratories, lecture halls, library. Bereket Fide public sector reference.',
  NOW(3), NOW(3)
),

-- 14. Mersin Free Zone Cold Storage — Mersin
(
  '55555001-0014-4555-8555-555500000014',
  '33333001-0014-4333-8333-333300000014',
  'en',
  'Mersin Free Zone Cold Storage — 12,000 m² Steel Structure',
  'mersin-free-zone-cold-storage-facility',
  'A 12,000 m² cold storage facility with steel structure was completed in the Mersin Free Zone.',
  '{"html":"<p>In the Mersin Free Zone, a <strong>12,000 m² cold storage facility</strong> was constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Mersin Free Zone</li><li>Type: Cold Storage Facility</li><li>Covered area: 12,000 m²</li><li>Structure: Prefabricated steel</li><li>Duration: July 2023 – December 2024</li></ul><h3>Specialised Insulation</h3><p>The facility features high-performance insulation for cold-chain logistics, prefabricated steel construction, and specialist floor finishes. Multiple temperature zones accommodate diverse storage requirements.</p>","description":"12,000 m² cold storage facility in Mersin Free Zone — prefabricated steel and insulation. Bereket Fide industrial project."}',
  'Mersin Free Zone Cold Storage — Bereket Fide Industrial Project',
  'Mersin Free Zone Cold Storage Facility — Bereket Fide',
  '12,000 m² cold storage facility in Mersin Free Zone. Prefabricated steel and insulation. Bereket Fide industrial reference.',
  NOW(3), NOW(3)
),

-- 15. Bodrum Villa Project — Muğla, Bodrum
(
  '55555001-0015-4555-8555-555500000015',
  '33333001-0015-4333-8333-333300000015',
  'en',
  'Bodrum Villa Project — 8 Sea-View Villas',
  'bodrum-villa-project-sea-view',
  'A project of 8 sea-view villas was completed in Bodrum, Muğla.',
  '{"html":"<p>Overlooking one of Bodrum''s most beautiful bays in Muğla, <strong>8 sea-view villas</strong> were constructed by Bereket Fide.</p><h3>Project Specifications</h3><ul><li>Location: Muğla, Bodrum</li><li>Type: Villa</li><li>Villas: 8</li><li>Duration: March 2023 – October 2024</li></ul><h3>Aegean Lifestyle</h3><p>Each villa features a private swimming pool, landscaped garden, and sea-view terrace. Natural stone cladding and a white-and-blue colour palette in keeping with Bodrum''s architectural character define the design.</p>","description":"8 sea-view villas in Bodrum — private pools and landscaping. Bereket Fide residential project."}',
  'Bodrum Villa Project Sea View — Bereket Fide Residential',
  'Bodrum Villa Project 8 Villas — Bereket Fide',
  '8 sea-view villas in Bodrum, Muğla. Private pools, landscaping and stone cladding. Bereket Fide residential reference.',
  NOW(3), NOW(3)
);

COMMIT;
