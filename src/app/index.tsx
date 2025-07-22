import HomeHeader from "@/components/HomeHeader";
import { View } from "react-native";

const summary = {
  total: "R$ 13.890,17",
  input: { label: "Entradas", value: "R$ 2.300,89" },
  output: { label: "Saídas", value: "R$ 400,53" },
};

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <HomeHeader data={summary} />
    </View>
  );
}
