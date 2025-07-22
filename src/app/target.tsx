import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Target() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 8 }}>
      <Text>Target Route</Text>
      <Button title="Voltar" onPress={() => router.navigate("/")} />
    </View>
  );
}
