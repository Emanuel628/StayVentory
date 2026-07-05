import { ReactNode } from 'react';
import { Href, Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@/src/theme/theme';

type ActionLink = {
  label: string;
  href: Href;
  primary?: boolean;
};

type TextLink = {
  label: string;
  href: Href;
};

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
  actions?: ActionLink[];
  links?: TextLink[];
};

export function AuthShell({ eyebrow, title, subtitle, children, actions = [], links = [] }: AuthShellProps) {
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces>
        <View style={styles.header}>
          <Text style={type.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.sheet}>
          {children}
          {actions.length ? (
            <View style={styles.actions}>
              {actions.map((action) => (
                <Link key={String(action.href)} href={action.href} asChild>
                  <Pressable
                    style={StyleSheet.flatten([
                      styles.button,
                      action.primary ? styles.primaryButton : styles.secondaryButton,
                    ])}>
                    <Text
                      style={StyleSheet.flatten([
                        styles.buttonLabel,
                        action.primary ? styles.primaryButtonLabel : styles.secondaryButtonLabel,
                      ])}>
                      {action.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          ) : null}
          {links.length ? (
            <View style={styles.links}>
              {links.map((link) => (
                <Link key={String(link.href)} href={link.href} asChild>
                  <Pressable style={styles.textLink}>
                    <Text style={styles.textLinkLabel}>{link.label}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.xl,
    paddingTop: 44,
    paddingBottom: 28,
    gap: 28,
  },
  header: {
    gap: space.sm,
    paddingTop: 24,
  },
  title: {
    ...type.screenGreeting,
    fontSize: 32,
  },
  subtitle: {
    ...type.noteBody,
    fontSize: 14,
    color: colors.inkBody,
    maxWidth: 300,
  },
  sheet: {
    backgroundColor: 'rgba(243, 238, 226, 0.92)',
    borderRadius: radius.sheet,
    padding: space.xl,
    gap: space.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  actions: {
    gap: space.sm,
    paddingTop: space.sm,
  },
  links: {
    gap: space.sm,
    paddingTop: space.xs,
    alignItems: 'flex-start',
  },
  button: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    paddingHorizontal: space.lg,
  },
  primaryButton: {
    backgroundColor: colors.teal,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: 'transparent',
  },
  buttonLabel: {
    ...type.buttonLabel,
  },
  primaryButtonLabel: {
    color: colors.buttonPrimaryText,
  },
  secondaryButtonLabel: {
    color: colors.ink,
  },
  textLink: {
    paddingVertical: 2,
  },
  textLinkLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
});
