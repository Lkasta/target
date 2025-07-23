import { useEffect, useState } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";

import { Alert, View } from "react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { CurrencyInput } from "@/components/CurrencyInput";
import { TargetProps } from "@/components/Target";

export default function Target() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const params = useLocalSearchParams<{ id?: string }>();
  const targetDB = useTargetDatabase();

  function handleSave() {
    if (!name.trim() || amount <= 0) {
      return Alert.alert("Anteção", "Preencha os campos com valores válidos! ");
    }

    setIsProcessing(true);

    if (params.id) {
      update();
    } else {
      create();
    }
  }

  async function create() {
    try {
      await targetDB.create({ name, amount });
      router.back();
    } catch (error) {
      console.warn(error);
    }
  }

  async function fetchDetails(id: number) {
    try {
      const response = await targetDB.show(id);

      if (!response) {
        console.warn("response is not valid");
        return;
      }

      setName(response.name);
      setAmount(response.amount);
    } catch (error) {
      console.warn(error);
    }
  }

  async function update() {
    try {
      await targetDB.update({ id: Number(params.id), name, amount });

      return Alert.alert("Sucesso!", "Meta atualizada!", [
        {
          text: "Ok",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.warn("Erro ao atualizar meta!", error);
      setIsProcessing(false);
    }
  }

  function handleRemove() {
    if (!params.id) {
      return;
    }

    Alert.alert("Atenção!", "Você realmente deseja remover essa meta?", [
      {
        text: "Não",
        style: "cancel",
      },
      { text: "Sim", onPress: remove },
    ]);
  }

  async function remove() {
    try {
      setIsProcessing(true);

      await targetDB.remove(Number(params.id));
      router.navigate("/");
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    fetchDetails(Number(params.id));
  }, [params.id]);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Metas"
        subtitle="Economize para aclcançar sua meta financeira."
        rightButton={
          params.id
            ? { icon: "delete", onPress: () => handleRemove() }
            : undefined
        }
      />
      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
          value={name}
          onChangeText={setName}
        />

        <CurrencyInput
          label="Valor alvo (R$)"
          value={amount}
          onChangeValue={setAmount}
        />

        <Button
          title="Salvar"
          onPress={handleSave}
          isProcessing={isProcessing}
        />
      </View>
    </View>
  );
}
