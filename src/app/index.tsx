import { Button } from "@/components/Button";
import HomeHeader from "@/components/HomeHeader";
import List from "@/components/List";
import Loading from "@/components/Loading";
import { Target, TargetProps } from "@/components/Target";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StatusBar, View } from "react-native";

const summary = {
  total: "Deveno até a Carça 🔥",
  input: { label: "Entradas", value: "R$ -0,01" },
  output: { label: "Saídas", value: "R$ nem te conto" },
};

export default function Index() {
  const [isFetching, setIsFetching] = useState(true);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const targetDB = useTargetDatabase();

  async function fetchTargets(): Promise<TargetProps[]> {
    try {
      const response = await targetDB.listValues();

      return response.map((resp) => ({
        id: String(resp.id),
        name: resp.name,
        current: numberToCurrency(resp.current),
        percentage: resp.percentage.toFixed(0) + "%",
        target: numberToCurrency(resp.amount),
      }));
    } catch (error) {
      console.warn(error);
      return [];
    }
  }

  async function fetchData() {
    const targetDataPromsise = fetchTargets();

    const [targetData] = await Promise.all([targetDataPromsise]);

    setTargets(targetData);
    setIsFetching(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isFetching) {
    return <Loading />;
  }
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
