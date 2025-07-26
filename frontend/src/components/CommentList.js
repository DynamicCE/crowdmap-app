import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ListItem, Rating } from 'react-native-elements';

export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return (
      <Text style={styles.emptyText}>Henüz yorum yapılmamış</Text>
    );
  }

  return (
    <View>
      {comments.map((comment) => (
        <ListItem key={comment.id} bottomDivider>
          <ListItem.Content>
            <View style={styles.header}>
              <Text style={styles.username}>{comment.user?.username}</Text>
              <Text style={styles.date}>
                {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
              </Text>
            </View>
            
            {comment.rating && (
              <Rating
                readonly
                startingValue={comment.rating}
                imageSize={16}
                style={styles.rating}
              />
            )}
            
            <ListItem.Title style={styles.commentText}>
              {comment.text}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rating: {
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
});