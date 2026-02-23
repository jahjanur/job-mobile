import { Share, Platform } from 'react-native';

import type { AppPost } from '../api/types';

export async function shareArticle(post: AppPost): Promise<void> {
  try {
    await Share.share(
      {
        title: post.title,
        message: Platform.OS === 'ios' ? post.title : `${post.title}\n${post.link}`,
        url: Platform.OS === 'ios' ? post.link : undefined,
      },
      { dialogTitle: `Share: ${post.title}` },
    );
  } catch {
    // user cancelled or share failed silently
  }
}
