import { Button } from "@/components/Button";
import HomeHeader from "@/components/HomeHeader";
import List from "@/components/List";
import { Target } from "@/components/Target";
import { router } from "expo-router";
import { StatusBar, View } from "react-native";

const summary = {
  total: "Deveno até a Carça 🔥",
  input: { label: "Entradas", value: "R$ -0,01" },
  output: { label: "Saídas", value: "R$ nem te conto" },
};

const targets = [
  {
    id: "1",
    name: "Compar uma Cadeira",
    current: "75%",
    percentage: "900,00",
    target: "1.200,00",
  },
  {
    id: "2",
    name: "Pagar dividas né pai",
    current: "50%",
    percentage: "250,00",
    target: "500,00",
  },
];

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <HomeHeader data={summary} />

      <List
        title="Metas"
        data={targets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Target
            data={item}
            onPress={() => router.navigate(`/in-progress/${item.id}`)}
          />
        )}
        emptyMessage="Nenhuma meta. Toque em nova meta para criar."
        containerStyle={{ paddingHorizontal: 24 }}
      />
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Button title="Nova meta" onPress={() => router.navigate("/target")} />
      </View>
    </View>
  );
}
