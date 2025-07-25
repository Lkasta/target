import { colors } from "@/theme/colors";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./styles";

export default function Loading() {
  return (
    <ActivityIndicator color={colors.blue[500]} style={styles.container} />
  );
}
