import { useState } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";

import { Alert, View } from "react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { CurrencyInput } from "@/components/CurrencyInput";

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
      // Update
    } else {
      create();
    }
  }

  async function create() {
    try {
      await targetDB.create({ name, amount });
      console.log("Meta criada com sucesso!");
      router.back()
    } catch (error) {}
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Metas"
        subtitle="Economize para aclcançar sua meta financeira."
      />
      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
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
