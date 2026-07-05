import { useFocusEffect } from 'expo-router';
import { AlertTriangle, PackageX, Wrench } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { listOwnerIssues } from '@/src/services/issues';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

type IssueRow = {
  id: string;
  title: string;
  description: string;
  category: 'repair' | 'maintenance' | 'replace';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'reviewing' | 'resolved';
  houses: {
    id: string;
    name: string;
  } | null;
  rooms: {
    id: string;
    name: string;
  } | null;
};

function getIssueVisual(category: IssueRow['category']) {
  if (category === 'replace') {
    return { icon: PackageX, color: colors.ochre, iconColor: colors.ochreOnDark, label: 'Replace' };
  }

  if (category === 'maintenance') {
    return { icon: AlertTriangle, color: colors.rust, iconColor: colors.rustOnDark, label: 'Maintenance' };
  }

  return { icon: Wrench, color: colors.rust, iconColor: colors.rustOnDark, label: 'Repair' };
}

export default function IssuesScreen() {
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadIssues = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await listOwnerIssues();

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setIssues(((data ?? []) as IssueRow[]).filter((issue) => issue.status !== 'resolved'));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load issues.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadIssues();
    }, [loadIssues]),
  );

  return (
    <Screen eyebrow="Issues" title="Repair, maintain, replace">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open items</Text>
        {isLoading ? <Text style={styles.meta}>Loading issues...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!isLoading && !error && !issues.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No open issues yet</Text>
            <Text style={styles.meta}>Repair, maintenance, and replacement items will appear here once the team starts reporting them.</Text>
          </View>
        ) : null}
        {issues.map((issue) => {
          const visual = getIssueVisual(issue.category);
          const Icon = visual.icon;

          return (
            <View key={issue.id} style={styles.issueRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconTile, { backgroundColor: visual.color }]}>
                  <Icon color={visual.iconColor} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{issue.title}</Text>
                  <Text style={styles.rowMeta}>
                    {(issue.houses?.name ?? 'House') + (issue.rooms?.name ? ` | ${issue.rooms.name}` : '')}
                  </Text>
                </View>
              </View>
              <Text style={styles.category}>{visual.label}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  sectionTitle: {
    ...type.eyebrow,
    color: colors.ink,
  },
  emptyState: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  emptyTitle: {
    ...type.body,
    color: colors.ink,
  },
  issueRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  iconTile: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: {
    gap: 2,
    flex: 1,
  },
  rowName: {
    ...type.houseName,
    color: colors.ink,
  },
  rowMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  category: {
    ...type.mono,
    color: colors.rust,
    textTransform: 'uppercase',
  },
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
});
