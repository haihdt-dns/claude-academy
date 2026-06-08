#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};
const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const PUBLIC_HTML = 'public_html';

const resolveGit = () => {
  const candidates = [
    'git',
    'C:\\Program Files\\Git\\bin\\git.exe',
    'C:\\Program Files (x86)\\Git\\bin\\git.exe',
  ];
  for (const g of candidates) {
    try {
      execSync(`"${g}" --version`, { stdio: 'pipe' });
      return g;
    } catch { continue; }
  }
  console.error(c('red', '❌ Không tìm thấy Git. Hãy cài Git và thêm vào PATH.'));
  process.exit(1);
};

const GIT = resolveGit();
const git = (cmd) => execSync(`"${GIT}" ${cmd}`, { encoding: 'utf-8', cwd: ROOT });

const hasHead = () => {
  try { git('rev-parse HEAD'); return true; } catch { return false; }
};

const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

// HTML file: only ?v=<hash> changed → cache busting only
const isCacheBustingOnlyDiff = (diff) => {
  const changed = diff.split('\n').filter(
    (l) => (l.startsWith('+') || l.startsWith('-')) && !l.startsWith('+++') && !l.startsWith('---')
  );
  if (changed.length === 0) return true;
  return changed.every((l) => /\?(?:v=[a-zA-Z0-9+\/=_-]+|[0-9]{10,})/.test(l.slice(1)));
};

// Non-HTML file in public_html: diff is empty → no real content change
const isEmptyDiff = (diff) => {
  const changed = diff.split('\n').filter(
    (l) => (l.startsWith('+') || l.startsWith('-')) && !l.startsWith('+++') && !l.startsWith('---')
  );
  return changed.length === 0;
};

// Parse git status --porcelain
const getChangedPublicFiles = () => {
  try {
    const result = git('status --porcelain');
    return result
      .trim()
      .split('\n')
      .filter((l) => l.length > 0)
      .filter((l) => l[0] === 'M' || l[1] === 'M') // modified only, skip new/untracked/added
      .map((l) => ({ file: l.slice(3).trim() }))
      .filter(({ file }) => file.startsWith(PUBLIC_HTML + '/') || file.startsWith(PUBLIC_HTML + '\\'));
  } catch {
    console.error(c('red', '❌ Lỗi khi lấy danh sách file thay đổi.'));
    process.exit(1);
  }
};

const getFileDiff = (file) => {
  try {
    const base = hasHead() ? 'HEAD' : EMPTY_TREE;
    return git(`diff ${base} -- "${file}"`);
  } catch { return ''; }
};

const discardFile = (file) => {
  if (hasHead()) {
    git(`checkout HEAD -- "${file}"`);
  } else {
    git(`rm --cached "${file}" -f`);
  }
};

const shouldDiscard = (file) => {
  const diff = getFileDiff(file);
  if (file.endsWith('.html')) return isCacheBustingOnlyDiff(diff);
  // Non-HTML in public_html: discard if no real content change
  return isEmptyDiff(diff);
};

const run = () => {
  console.log(c('bold', '\n🔍 Đang phân tích file trong public_html...\n'));
  console.log(`   Root: ${ROOT}\n`);

  const files = getChangedPublicFiles();

  if (files.length === 0) {
    console.log(c('yellow', 'Không có file nào thay đổi trong public_html.'));
    return;
  }

  const discarded = [];
  const kept = [];

  for (const { file } of files) {
    if (shouldDiscard(file)) {
      discardFile(file);
      discarded.push(file);
    } else {
      kept.push(file);
    }
  }

  if (discarded.length > 0) {
    console.log(c('green', `✅ Đã discard ${discarded.length} file:`));
    discarded.forEach((f) => console.log(`   ${c('cyan', f)}`));
    console.log('');
  }

  if (kept.length > 0) {
    console.log(c('yellow', `📝 Giữ lại ${kept.length} file (có thay đổi thật):`));
    kept.forEach((f) => console.log(`   ${c('bold', f)}`));
  } else {
    console.log(c('yellow', 'Không có file nào trong public_html có thay đổi thật.'));
  }

  console.log('');
};

run();
