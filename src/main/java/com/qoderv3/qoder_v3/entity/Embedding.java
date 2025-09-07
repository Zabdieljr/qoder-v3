package com.qoderv3.qoder_v3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Embedding entity representing AI vector embeddings in the qoder-v3 application.
 * This entity maps to the 'embeddings' table in the PostgreSQL database.
 */
@Entity
@Table(name = "embeddings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Embedding {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "UUID")
    private UUID id;
    
    @Column(name = "content_id", nullable = false)
    private UUID contentId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private EmbeddingContentType contentType;
    
    @Column(name = "content_text", nullable = false, columnDefinition = "TEXT")
    private String contentText;
    
    @Column(name = "embedding_vector", columnDefinition = "vector(1536)")
    private String embeddingVector;
    
    @Column(name = "embedding_model", length = 100)
    private String embeddingModel = "text-embedding-ada-002";
    
    @Column(name = "chunk_index")
    private Integer chunkIndex = 0;
    
    @Column(name = "chunk_total")
    private Integer chunkTotal = 1;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "JSONB")
    private Map<String, Object> metadata;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    // Helper methods
    
    /**
     * Checks if this embedding is part of a multi-chunk content
     * @return true if chunk_total > 1
     */
    public boolean isMultiChunk() {
        return chunkTotal != null && chunkTotal > 1;
    }
    
    /**
     * Checks if this is the first chunk
     * @return true if chunk_index is 0
     */
    public boolean isFirstChunk() {
        return chunkIndex != null && chunkIndex == 0;
    }
    
    /**
     * Checks if this is the last chunk
     * @return true if chunk_index is chunk_total - 1
     */
    public boolean isLastChunk() {
        return chunkIndex != null && chunkTotal != null && 
               chunkIndex.equals(chunkTotal - 1);
    }
    
    /**
     * Gets the chunk position as a string (e.g., "1/3")
     * @return formatted chunk position
     */
    public String getChunkPosition() {
        if (!isMultiChunk()) {
            return "1/1";
        }
        return (chunkIndex + 1) + "/" + chunkTotal;
    }
    
    /**
     * Gets the vector dimensions if vector is set
     * @return number of dimensions or -1 if vector is null
     */
    public int getVectorDimensions() {
        if (embeddingVector == null) {
            return -1;
        }
        // Simple parsing assuming vector format "[x,y,z,...]"
        try {
            String[] parts = embeddingVector.replace("[", "").replace("]", "").split(",");
            return parts.length;
        } catch (Exception e) {
            return -1;
        }
    }
    
    /**
     * Adds metadata key-value pair
     * @param key metadata key
     * @param value metadata value
     */
    public void addMetadata(String key, Object value) {
        if (this.metadata == null) {
            this.metadata = new java.util.HashMap<>();
        }
        this.metadata.put(key, value);
    }
    
    /**
     * Gets metadata value by key
     * @param key metadata key
     * @return metadata value or null if not found
     */
    public Object getMetadata(String key) {
        return metadata != null ? metadata.get(key) : null;
    }
    
    /**
     * Gets metadata value by key with type casting
     * @param key metadata key
     * @param type expected type class
     * @param <T> type parameter
     * @return typed metadata value or null if not found or wrong type
     */
    @SuppressWarnings("unchecked")
    public <T> T getMetadata(String key, Class<T> type) {
        Object value = getMetadata(key);
        if (value != null && type.isInstance(value)) {
            return (T) value;
        }
        return null;
    }
    
    /**
     * Checks if the embedding has a specific metadata key
     * @param key metadata key to check
     * @return true if key exists in metadata
     */
    public boolean hasMetadata(String key) {
        return metadata != null && metadata.containsKey(key);
    }
}