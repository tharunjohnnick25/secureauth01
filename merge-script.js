import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const backendDir = path.join(rootDir, 'backend');
const srcDir = path.join(rootDir, 'src');

function copyRecursiveSync(src, dest) {
  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(child => {
        copyRecursiveSync(path.join(src, child), path.join(dest, child));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// 1. Read existing package.json files
const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const backendPkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf8'));

// 2. Merge dependencies
const mergedDependencies = { ...rootPkg.dependencies, ...backendPkg.dependencies };
const mergedDevDependencies = { ...rootPkg.devDependencies, ...backendPkg.devDependencies };

// 3. Create new package.json
const newPkg = {
  ...backendPkg,
  name: "unified-cyber-auth",
  dependencies: mergedDependencies,
  devDependencies: mergedDevDependencies,
};
delete newPkg.peerDependencies;
delete newPkg.peerDependenciesMeta;
delete newPkg.pnpm;

// 4. Move backend files to root
const backendFiles = fs.readdirSync(backendDir);
backendFiles.forEach(file => {
  if (file === 'node_modules' || file === '.next') return;
  copyRecursiveSync(path.join(backendDir, file), path.join(rootDir, file));
});

fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify(newPkg, null, 2));

// 5. Migrate components
const frontendComponentsDir = path.join(srcDir, 'app', 'components');
const rootComponentsDir = path.join(rootDir, 'components');
if (!fs.existsSync(rootComponentsDir)) fs.mkdirSync(rootComponentsDir, { recursive: true });

// Move UI components
if (fs.existsSync(frontendComponentsDir)) {
  copyRecursiveSync(frontendComponentsDir, rootComponentsDir);
}

// 6. Migrate pages to Next.js app directory
const frontendPagesDir = path.join(srcDir, 'app', 'pages');
const rootAppDir = path.join(rootDir, 'app');

if (fs.existsSync(frontendPagesDir)) {
  const pages = fs.readdirSync(frontendPagesDir).filter(f => f.endsWith('.tsx'));
  
  pages.forEach(page => {
    const pageName = page.replace('.tsx', '');
    const route = pageName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    
    // Copy the original page component to components/pages/
    const componentsPagesDir = path.join(rootComponentsDir, 'pages');
    if (!fs.existsSync(componentsPagesDir)) fs.mkdirSync(componentsPagesDir, { recursive: true });
    
    let content = fs.readFileSync(path.join(frontendPagesDir, page), 'utf8');
    
    // Replace react-router with next/navigation
    content = content.replace(/import \{.*useNavigate.*\} from ['"]react-router['"];?/g, "import { useRouter } from 'next/navigation';");
    content = content.replace(/const navigate = useNavigate\(\);?/g, "const router = useRouter();\n  const navigate = (path: string) => router.push(path);");
    
    // Replace alias
    content = content.replace(/from ['"]\.\.\//g, "from '@/components/");
    content = content.replace(/from ['"]\.\//g, "from '@/components/pages/");
    
    fs.writeFileSync(path.join(componentsPagesDir, page), content);

    // Skip creating Next.js page if it already exists in backend (e.g. login, dashboard)
    const existingAppRouteDir = path.join(rootAppDir, route === 'login' ? 'login' : route === 'dashboard' ? 'dashboard' : route);
    if (!fs.existsSync(existingAppRouteDir)) {
      fs.mkdirSync(existingAppRouteDir, { recursive: true });
      fs.writeFileSync(path.join(existingAppRouteDir, 'page.tsx'), `
import ${pageName} from '@/components/pages/${pageName}';

export default function Page() {
  return <${pageName} />;
}
      `);
    } else {
      // If it exists, we might want to update it to use the frontend UI, but we keep backend logic
      // Since it's automated, we leave the backend generated pages (login, dashboard) intact to preserve the Supabase hooks.
    }
  });
}

// 7. Cleanup
// Only clean up after testing
console.log('Merge complete');
