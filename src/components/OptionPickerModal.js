import React from "react";
import { Modal, View, Text, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OptionPickerModal({
  visible,
  title,
  options = [],
  onClose,
  onSelect,
  selectedValue,
  getLabel = (item) => item?.label || "",
  getValue = (item) => item?.value,
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onPress={onClose}
        />

        <View
          style={{
            width: "100%",
            maxWidth: 420,
            maxHeight: "75%",
            backgroundColor: "#fff",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 56,
              borderBottomWidth: 1,
              borderBottomColor: "#EEF2F7",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 17,
                fontWeight: "700",
                color: "#111827",
              }}
            >
              {title}
            </Text>

            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color="#111827" />
            </Pressable>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item, index) => String(getValue(item) ?? index)}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const value = getValue(item);
              const isSelected = value === selectedValue;

              return (
                <Pressable
                  onPress={() => {
                    onSelect?.(item);
                    onClose?.();
                  }}
                  style={{
                    minHeight: 52,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#F3F4F6",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 15,
                      color: isSelected ? "#DC2626" : "#111827",
                      fontWeight: isSelected ? "700" : "400",
                    }}
                  >
                    {getLabel(item)}
                  </Text>

                  {isSelected ? (
                    <Ionicons name="checkmark" size={20} color="#DC2626" />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
