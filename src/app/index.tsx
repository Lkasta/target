import { Button } from "@/components/Button";
import { HomeHeader, HomeHeaderProps } from "@/components/HomeHeader";
import List from "@/components/List";
import Loading from "@/components/Loading";
import { Target, TargetProps } from "@/components/Target";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StatusBar, View } from "react-native";

export default function Index() {
  const [summary, setSummary] = useState<HomeHeaderProps>({
    total: numberToCurrency(0),
    input: { label: "Entradas", value: numberToCurrency(0) },
    output: { label: "Saídas", value: numberToCurrency(0) },
  });
  const [isFetching, setIsFetching] = useState(true);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const targetDB = useTargetDatabase();
  const transactionDB = useTransactionsDatabase();

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

  async function fetchSummary(): Promise<HomeHeaderProps> {
    try {
      const response = await transactionDB.summary();

      if (!response) {
        throw new Error("Resposta inválida do banco de dados");
      }

      return {
        total: numberToCurrency(response?.input + response?.output),
        input: { label: "Entradas", value: numberToCurrency(response.input) },
        output: { label: "Saídas", value: numberToCurrency(response.output) },
      };
    } catch (error) {
      console.warn(error);
      return {
        total: numberToCurrency(0),
        input: { label: "Entradas", value: numberToCurrency(0) },
        output: { label: "Saídas", value: numberToCurrency(0) },
      };
    }
  }

  async function fetchData() {
    const targetDataPromsise = fetchTargets();
    const fetchSummaryPromise = fetchSummary();

    const [targetData, dataSummary] = await Promise.all([
      targetDataPromsise,
      fetchSummaryPromise,
    ]);

    setTargets(targetData);
    setSummary(dataSummary);
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
