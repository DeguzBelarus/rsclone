import { lng } from 'hooks/useLanguage/types';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import TitleIcon from '@mui/icons-material/Title';
import BrushIcon from '@mui/icons-material/Brush';
import AddLinkIcon from '@mui/icons-material/AddLink';
import OrderedListIcon from '@mui/icons-material/FormatListNumbered';
import UnorderedListIcon from '@mui/icons-material/FormatListBulleted';
import CodeIcon from '@mui/icons-material/Code';

export const editorActions = [
  { style: 'BOLD', icon: FormatBoldIcon, title: lng.formatBold, shortcut: 'Ctrl+B' },
  { style: 'ITALIC', icon: FormatItalicIcon, title: lng.formatItalic, shortcut: 'Ctrl+I' },
  {
    style: 'UNDERLINE',
    icon: FormatUnderlinedIcon,
    title: lng.formatUnderline,
    shortcut: 'Ctrl+U',
  },
  { style: 'HIGHLIGHT', icon: BrushIcon, title: lng.formatHighlight, shortcut: 'Ctrl+M' },
  { style: 'DIVIDER' },
  {
    style: 'header-two',
    icon: TitleIcon,
    title: lng.formatTitle,
    shortcut: 'Ctrl+H',
    block: true,
  },
  {
    style: 'ordered-list-item',
    icon: OrderedListIcon,
    title: lng.formatNumberedList,
    shortcut: 'Ctrl+O',
    block: true,
  },
  {
    style: 'unordered-list-item',
    icon: UnorderedListIcon,
    title: lng.formatBulletedList,
    shortcut: 'Ctrl+L',
    block: true,
  },
  {
    style: 'code-block',
    icon: CodeIcon,
    title: lng.formatCode,
    shortcut: 'Ctrl+P',
    block: true,
  },
  { style: 'LINK', icon: AddLinkIcon, title: lng.formatAddLink, shortcut: 'Ctrl+K' },
  { style: 'DIVIDER' },
  { style: 'EMOJI' },
];
