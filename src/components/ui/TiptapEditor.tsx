import React, { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import { MentionList, type MentionItem } from './MentionList';

interface TiptapEditorProps {
  content: string;
  onSubmit: (html: string) => void;
  placeholder?: string;
  mentionItems: MentionItem[];
  autoFocus?: boolean;
  compact?: boolean;
  onCancel?: () => void;
  submitOnEnter?: boolean;
  clearOnSubmit?: boolean;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onSubmit,
  placeholder = 'Piš zde...',
  mentionItems,
  autoFocus = false,
  compact = false,
  onCancel,
  submitOnEnter = false,
  clearOnSubmit = false,
}) => {
  const mentionItemsRef = useRef(mentionItems);
  const isMentionOpenRef = useRef(false);
  const onSubmitRef = useRef(onSubmit);
  const onCancelRef = useRef(onCancel);

  useEffect(() => { mentionItemsRef.current = mentionItems; }, [mentionItems]);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);
  useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        blockquote: false,
        strike: false,
        horizontalRule: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        renderHTML({ node }) {
          return [
            'span',
            {
              class: 'mention',
              'data-type': 'mention',
              'data-mention-type': node.attrs.type || 'npc',
              'data-id': node.attrs.id || '',
              'data-label': node.attrs.label || '',
            },
            `@${node.attrs.label ?? node.attrs.id}`,
          ];
        },
        suggestion: {
          items: ({ query }: { query: string }) => {
            return mentionItemsRef.current
              .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 6);
          },
          render: () => {
            let component: ReactRenderer | null = null;
            let popup: TippyInstance[] | null = null;

            return {
              onStart: (props: any) => {
                isMentionOpenRef.current = true;
                component = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) return;

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },

              onUpdate(props: any) {
                component?.updateProps(props);

                if (!props.clientRect) return;

                popup?.[0]?.setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },

              onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                  popup?.[0]?.hide();
                  isMentionOpenRef.current = false;
                  return true;
                }

                return (component?.ref as any)?.onKeyDown(props) ?? false;
              },

              onExit() {
                popup?.[0]?.destroy();
                component?.destroy();
                isMentionOpenRef.current = false;
              },
            };
          },
        },
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[3rem] px-3 py-2 font-serif text-sm text-stone-700',
        'data-placeholder': placeholder,
      },
      handleKeyDown: (_view, event) => {
        if (event.key === 'Escape') {
          onCancelRef.current?.();
          return true;
        }
        if (event.key === 'Enter' && !event.shiftKey && submitOnEnter && !isMentionOpenRef.current) {
          event.preventDefault();
          const html = editor?.getHTML() || '';
          const text = editor?.getText() || '';
          if (text.trim()) {
            onSubmitRef.current(html);
            if (clearOnSubmit) {
              editor?.commands.clearContent();
            }
          }
          return true;
        }
        return false;
      },
    },
    autofocus: autoFocus ? 'end' : false,
  });

  // Handle blur save for compact (edit) mode
  const handleBlur = useCallback(() => {
    if (compact && editor && !isMentionOpenRef.current) {
      setTimeout(() => {
        const html = editor.getHTML();
        const text = editor.getText();
        if (text.trim()) {
          onSubmitRef.current(html);
        }
      }, 150);
    }
  }, [compact, editor]);

  if (!editor) return null;

  return (
    <div className={`tiptap-editor ${compact ? 'tiptap-compact' : ''}`}>
      {!compact && (
        <div className="flex items-center gap-0.5 px-2 py-1 border-b border-stone-200 bg-stone-50 rounded-t-lg">
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Tučné (Ctrl+B)"
          >
            B
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Kurzíva (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
          <span className="w-px h-4 bg-stone-300 mx-1" />
          <ToolbarButton
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Nadpis 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Nadpis 3"
          >
            H3
          </ToolbarButton>
          <span className="w-px h-4 bg-stone-300 mx-1" />
          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Odrážkový seznam"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Číslovaný seznam"
          >
            1.
          </ToolbarButton>
        </div>
      )}
      <div
        className={compact
          ? 'border-b border-amber-400 focus-within:border-amber-600'
          : 'border border-stone-200 border-t-0 rounded-b-lg bg-white/50 focus-within:border-amber-500'
        }
        onBlur={handleBlur}
      >
        <EditorContent editor={editor} />
      </div>
      {!compact && (
        <div className="flex justify-between items-center mt-1 px-1">
          <span className="text-xs text-stone-400">
            @ pro zmínku {submitOnEnter ? '• Enter ↵ odešle • Shift+Enter = nový řádek' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

const ToolbarButton: React.FC<{
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ active, onClick, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
      active
        ? 'bg-amber-200 text-amber-900'
        : 'text-stone-500 hover:bg-stone-200 hover:text-stone-700'
    }`}
  >
    {children}
  </button>
);
