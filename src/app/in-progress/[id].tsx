import List from "@/components/List";
import Loading from "@/components/Loading";
import { Button } from "@/components/Button";

import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { Transaction, TransactionProps } from "@/components/Transaction";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import dayjs from "dayjs";

export default function InProgress() {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [details, setDetails] = useState({
    name: "",
    current: "R$ 0,00",
    target: "R$ 0,00",
    percentage: 0,
  });

  const params = useLocalSearchParams<{ id: string }>();

  const targetDB = useTargetDatabase();
  const transactionsDB = useTransactionsDatabase();

  async function fetchDetails() {
    try {
      const response = await targetDB.show(Number(params.id));

      if (!response) {
        console.warn("Nenhum dado encontrado para o ID:", params.id);
        return;
      }

      setDetails({
        name: response.name,
        current: numberToCurrency(response.current),
        target: numberToCurrency(response.amount),
        percentage: response.percentage,
      });
    } catch (error) {
      console.warn(error);
    }
  }

  async function fetchTransitions() {
    try {
      const response = await transactionsDB.listByTargetId(Number(params.id));

      setTransactions(
        response.map((resp) => ({
          id: String(resp.id),
          value: numberToCurrency(resp.amount),
          date: dayjs(resp.created_at).format("DD/MM/YYYY HH:mm"),
          description: resp.observation,
          type:
            resp.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input,
        }))
      );
    } catch (error) {
      console.warn(error);
    }
  }

  async function fetchData() {
    const fetchDetailsPromise = fetchDetails();
    const fetchTransitionsPromise = fetchTransitions();

    await Promise.all([fetchDetailsPromise, fetchTransitionsPromise]);
    setIsFetching(false);
  }

  async function handleTransactionRemove(id: string) {
    try {
      Alert.alert("Atenção!", "Você realmente deseja remover essa transação?", [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => remove(id),
        },
      ]);
    } catch (error) {
      console.warn(error);
    }
  }

  async function remove(id: string) {
    try {
      await transactionsDB.remove(Number(id));
      fetchData;
    } catch (error) {}
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
    <View style={{ flex: 1, padding: 24, gap: 32 }}>
      <PageHeader
        title={details.name}
        rightButton={{
          icon: "edit",
          onPress: () => router.navigate(`/target?id=${params.id}`),
        }}
      />

      <Progress data={details} />

      <List
        title="Transações"
        data={transactions}
        renderItem={({ item }) => (
          <Transaction
            data={item}
            onRemove={() => handleTransactionRemove(item.id)}
          />
        )}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />

      <Button
        title="Nova transação"
        onPress={() => router.navigate(`/transaction/${params.id}`)}
      />
    </View>
  );
}
