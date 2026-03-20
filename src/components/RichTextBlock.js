// src/screens/Coach/components/RichTextBlock.js
import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

export default function RichTextBlock({
  valueHtml,
  onChangeHtml,
  placeholder,
}) {
  const editorRef = useRef(null);

  return (
    <View style={s.wrap}>
      <RichToolbar
        editor={editorRef}
        style={s.toolbar}
        iconTint="#111827"
        selectedIconTint="#111827"
        disabledIconTint="#9CA3AF"
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.insertBulletsList,
          actions.insertOrderedList,
        ]}
      />

      <View style={s.greyBox}>
        <RichEditor
          ref={editorRef}
          style={s.editor}
          initialContentHTML={valueHtml || ""}
          placeholder={placeholder || ""}
          onChange={onChangeHtml}
          editorStyle={{
            backgroundColor: "transparent",
            color: "#111827",
            placeholderColor: "#9CA3AF",
            cssText: `
              body { font-size: 16px; line-height: 22px; }
              * { font-family: -apple-system, system-ui; }
            `,
          }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: "#EEF2F8" },

  toolbar: {
    backgroundColor: "#EEF2F8",
    paddingVertical: 6,
  },

  greyBox: {
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    minHeight: 92,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  editor: {
    flex: 1,
    minHeight: 76,
  },
});
