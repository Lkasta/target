import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 8, gap: 8 }}>
      <Text>InProgress</Text>
      <Text>ID: {params.id} </Text>
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}
