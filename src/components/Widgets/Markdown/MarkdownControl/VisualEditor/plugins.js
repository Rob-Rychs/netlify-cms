import { Text, Inline } from 'slate';
import SlateSoftBreak from 'slate-soft-break';
import EditList from 'slate-edit-list';
import EditTable from 'slate-edit-table';

const SoftBreak = (options = {}) => ({
  onKeyDown(e, data, change) {
    if (data.key != 'enter') return;
    if (options.shift && e.shiftKey == false) return;

    const { onlyIn, ignoreIn, defaultBlock = 'paragraph' } = options;
    const { type, text } = change.value.startBlock;
    if (onlyIn && !onlyIn.includes(type)) return;
    if (ignoreIn && ignoreIn.includes(type)) return;

    const shouldClose = text.endsWith('\n');
    if (shouldClose) {
      return change
        .deleteBackward(1)
        .insertBlock(defaultBlock);
    }

    const textNode = Text.create('\n');
    const breakNode = Inline.create({ type: 'break', nodes: [ textNode ] });
    return change
      .insertInline(breakNode)
      .insertText('')
      .collapseToStartOfNextText();
  }
});

const SoftBreakOpts = {
  onlyIn: ['quote', 'code'],
};

export const SoftBreakConfigured = SoftBreak(SoftBreakOpts);

export const ParagraphSoftBreakConfigured = SoftBreak({ onlyIn: ['paragraph'], shift: true });

const BreakToDefaultBlock = ({ onlyIn = [], defaultBlock = 'paragraph' }) => ({
  onKeyDown(e, data, change) {
    const { value } = change;
    if (data.key != 'enter' || e.shiftKey == true || value.isExpanded) return;
    if (onlyIn.includes(value.startBlock.type)) {
      return change.insertBlock(defaultBlock);
    }
  }
});

const BreakToDefaultBlockOpts = {
  onlyIn: ['heading-one', 'heading-two', 'heading-three', 'heading-four', 'heading-five', 'heading-six'],
};

export const BreakToDefaultBlockConfigured = BreakToDefaultBlock(BreakToDefaultBlockOpts);

const BackspaceCloseBlock = (options = {}) => ({
  onKeyDown(e, data, change) {
    if (data.key != 'backspace') return;

    const { defaultBlock = 'paragraph', ignoreIn, onlyIn } = options;
    const { startBlock } = change.value;
    const { type } = startBlock;

    if (onlyIn && !onlyIn.includes(type)) return;
    if (ignoreIn && ignoreIn.includes(type)) return;

    if (startBlock.text === '') {
      return change.setBlock(defaultBlock).focus();
    }
  }
});

const BackspaceCloseBlockOpts = {
  ignoreIn: [
    'paragraph',
    'list-item',
    'bulleted-list',
    'numbered-list',
    'table',
    'table-row',
    'table-cell',
  ],
};

export const BackspaceCloseBlockConfigured = BackspaceCloseBlock(BackspaceCloseBlockOpts);

const EditListOpts = {
  types: ['bulleted-list', 'numbered-list'],
  typeItem: 'list-item',
};

export const EditListConfigured = EditList(EditListOpts);

const EditTableOpts = {
  typeTable: 'table',
  typeRow: 'table-row',
  typeCell: 'table-cell',
};

export const EditTableConfigured = EditTable(EditTableOpts);

const plugins = [
  SoftBreakConfigured,
  ParagraphSoftBreakConfigured,
  BackspaceCloseBlockConfigured,
  BreakToDefaultBlockConfigured,
  EditListConfigured,
];

export default plugins;
