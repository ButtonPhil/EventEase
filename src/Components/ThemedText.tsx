// src/Components/ThemedText.tsx
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../Hooks/useThemeColors';
import { Colors } from '../Constants/colors';

const styles = StyleSheet.create({
  // Tailles de texte standards
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  captionSmall: {
    fontSize: 10,
    lineHeight: 14,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
});

type ThemeColor = keyof typeof Colors.light;
type Variant = keyof typeof styles;

type ThemedTextProps = TextProps & {
  variant?: Variant;
  color?: ThemeColor;
};

export function ThemedText({ variant = 'body', color, style, ...rest }: ThemedTextProps) {
  const colors = useThemeColors();
  
  return (
    <Text
      style={[
        styles[variant],
        { color: color ? colors[color] : colors.text },
        style,
      ]}
      {...rest}
    />
  );
}