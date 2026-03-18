import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const requiredFiles = [
  path.join(ROOT, 'src', 'lib', 'media-seo.ts'),
  path.join(ROOT, 'scripts', 'audit-media-seo.mjs'),
];

const mediaFiles = [
  path.join(ROOT, 'src', 'app', '[locale]', 'page.tsx'),
  path.join(ROOT, 'src', 'app', '[locale]', 'projeler', 'page.tsx'),
  path.join(ROOT, 'src', 'app', '[locale]', 'projeler', '[slug]', 'page.tsx'),
  path.join(ROOT, 'src', 'app', '[locale]', 'haberler', 'page.tsx'),
  path.join(ROOT, 'src', 'app', '[locale]', 'galeri', 'page.tsx'),
  path.join(ROOT, 'src', 'app', '[locale]', 'galeri', '[slug]', 'page.tsx'),
];

const failures = [];

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    failures.push(`Missing media SEO file: ${path.relative(ROOT, file)}`);
  }
}

for (const file of mediaFiles) {
  try {
    const source = await readFile(file, 'utf8');
    if (!source.includes('buildMediaAlt')) {
      failures.push(`${path.relative(ROOT, file)}: missing buildMediaAlt usage`);
    }
  } catch {
    // File may not exist yet — skip
  }
}

const galleryDetailPath = path.join(ROOT, 'src', 'app', '[locale]', 'galeri', '[slug]', 'page.tsx');
try {
  const galleryDetailSource = await readFile(galleryDetailPath, 'utf8');
  if (!galleryDetailSource.includes('resolveMediaDimensions')) {
    failures.push('src/app/[locale]/galeri/[slug]/page.tsx: missing resolveMediaDimensions usage');
  }
} catch {
  // Gallery detail may not exist yet
}

const weakAltPatterns = [
  /alt=\{[^}]*title\s*\|\|\s*''\}/,
  /alt=\{[^}]*title\s*\|\|\s*""\}/,
  /alt=\{[^}]*cover_image_alt\s*\|\|[^}]*title\s*\|\|\s*''\}/,
];

for (const file of mediaFiles) {
  try {
    const source = await readFile(file, 'utf8');
    if (weakAltPatterns.some((pattern) => pattern.test(source))) {
      failures.push(`${path.relative(ROOT, file)}: weak title-only alt fallback found`);
    }
  } catch {
    // Skip missing files
  }
}

if (failures.length > 0) {
  console.error('Media SEO check failed:\n' + failures.map((line) => `- ${line}`).join('\n'));
  process.exit(1);
}

console.log('Media SEO check passed');
