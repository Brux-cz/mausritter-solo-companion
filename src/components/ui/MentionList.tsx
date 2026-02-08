import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface MentionItem {
  type: string;
  id: string;
  name: string;
  icon: string;
}

interface MentionListProps {
  items: MentionItem[];
  command: (attrs: { id: string; label: string; type: string }) => void;
}

export const MentionList = forwardRef<any, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.name, type: item.type });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
      {props.items.map((item, index) => (
        <button
          key={`${item.type}-${item.id}`}
          type="button"
          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-amber-50 transition-colors ${
            index === selectedIndex ? 'bg-amber-100' : ''
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            selectItem(index);
          }}
        >
          <span>{item.icon}</span>
          <span className="font-medium text-stone-800">{item.name}</span>
          <span className="text-xs text-stone-400 ml-auto">
            {item.type === 'npc' ? 'NPC' : item.type === 'settlement' ? 'Osada' : 'Postava'}
          </span>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = 'MentionList';
