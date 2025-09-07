package com.qoderv3.qoder_v3.repository;

import com.qoderv3.qoder_v3.entity.Embedding;
import com.qoderv3.qoder_v3.entity.EmbeddingContentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Embedding entity operations.
 * Provides CRUD operations and custom queries for AI embedding management.
 */
@Repository
public interface EmbeddingRepository extends JpaRepository<Embedding, UUID> {
    
    /**
     * Find embeddings by content ID
     * @param contentId the content ID to search for
     * @return List of embeddings for the content
     */
    List<Embedding> findByContentId(UUID contentId);
    
    /**
     * Find embeddings by content ID and type
     * @param contentId the content ID
     * @param contentType the content type
     * @return List of embeddings matching the criteria
     */
    List<Embedding> findByContentIdAndContentType(UUID contentId, EmbeddingContentType contentType);
    
    /**
     * Find embeddings by content type
     * @param contentType the content type
     * @param pageable pagination information
     * @return Page of embeddings with the specified type
     */
    Page<Embedding> findByContentType(EmbeddingContentType contentType, Pageable pageable);
    
    /**
     * Find embeddings by embedding model
     * @param embeddingModel the embedding model name
     * @param pageable pagination information
     * @return Page of embeddings created with the specified model
     */
    Page<Embedding> findByEmbeddingModel(String embeddingModel, Pageable pageable);
    
    /**
     * Find embeddings created after a specific date
     * @param date the date to search after
     * @return List of embeddings created after the date
     */
    List<Embedding> findByCreatedAtAfter(OffsetDateTime date);
    
    /**
     * Find multi-chunk embeddings by content ID
     * @param contentId the content ID
     * @return List of embeddings ordered by chunk index
     */
    @Query("SELECT e FROM Embedding e WHERE e.contentId = :contentId AND e.chunkTotal > 1 ORDER BY e.chunkIndex")
    List<Embedding> findMultiChunkEmbeddingsByContentId(@Param("contentId") UUID contentId);
    
    /**
     * Find the first chunk of multi-chunk content
     * @param contentId the content ID
     * @param contentType the content type
     * @return List of first chunks (chunk_index = 0)
     */
    @Query("SELECT e FROM Embedding e WHERE e.contentId = :contentId AND e.contentType = :contentType AND e.chunkIndex = 0")
    List<Embedding> findFirstChunkByContentIdAndType(@Param("contentId") UUID contentId, @Param("contentType") EmbeddingContentType contentType);
    
    /**
     * Find similar embeddings using vector similarity
     * Note: This is a placeholder query. In practice, you would use the PostgreSQL function
     * created in the migration script or implement custom vector similarity logic.
     * 
     * @param queryVector the query vector as string
     * @param contentType optional content type filter
     * @param threshold similarity threshold
     * @param limit maximum results
     * @return List of similar embeddings
     */
    @Query(value = "SELECT * FROM find_similar_embeddings(CAST(:queryVector AS vector), " +
                   "CAST(:contentType AS embedding_content_type), :threshold, :limit)", 
           nativeQuery = true)
    List<Object[]> findSimilarEmbeddings(@Param("queryVector") String queryVector,
                                        @Param("contentType") String contentType,
                                        @Param("threshold") Double threshold,
                                        @Param("limit") Integer limit);
    
    /**
     * Search embeddings by content text (full-text search)
     * @param searchTerm the term to search for
     * @param pageable pagination information
     * @return Page of embeddings with matching content text
     */
    @Query(value = "SELECT * FROM embeddings e WHERE " +
           "to_tsvector('english', e.content_text) @@ plainto_tsquery('english', :searchTerm)", nativeQuery = true)
    Page<Embedding> searchByContentText(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Find embeddings with specific metadata key
     * @param metadataKey the metadata key to search for
     * @param pageable pagination information
     * @return Page of embeddings containing the metadata key
     */
    @Query(value = "SELECT * FROM embeddings e WHERE e.metadata ? :metadataKey", nativeQuery = true)
    Page<Embedding> findByMetadataKey(@Param("metadataKey") String metadataKey, Pageable pageable);
    
    /**
     * Find embeddings with specific metadata key-value pair
     * @param metadataKey the metadata key
     * @param metadataValue the metadata value
     * @param pageable pagination information
     * @return Page of embeddings with matching metadata
     */
    @Query(value = "SELECT * FROM embeddings e WHERE e.metadata ->> :metadataKey = :metadataValue", nativeQuery = true)
    Page<Embedding> findByMetadataKeyValue(@Param("metadataKey") String metadataKey, 
                                          @Param("metadataValue") String metadataValue, 
                                          Pageable pageable);
    
    /**
     * Count embeddings by content type
     * @param contentType the content type
     * @return count of embeddings with the type
     */
    long countByContentType(EmbeddingContentType contentType);
    
    /**
     * Count embeddings by embedding model
     * @param embeddingModel the embedding model
     * @return count of embeddings created with the model
     */
    long countByEmbeddingModel(String embeddingModel);
    
    /**
     * Get statistics about embeddings
     * @return List of embedding statistics by content type
     */
    @Query(value = "SELECT * FROM get_embeddings_stats()", nativeQuery = true)
    List<Object[]> getEmbeddingStatistics();
    
    /**
     * Delete embeddings by content ID
     * @param contentId the content ID
     * @return number of deleted embeddings
     */
    @Modifying
    @Query("DELETE FROM Embedding e WHERE e.contentId = :contentId")
    int deleteByContentId(@Param("contentId") UUID contentId);
    
    /**
     * Delete embeddings by content ID and type
     * @param contentId the content ID
     * @param contentType the content type
     * @return number of deleted embeddings
     */
    @Modifying
    @Query("DELETE FROM Embedding e WHERE e.contentId = :contentId AND e.contentType = :contentType")
    int deleteByContentIdAndContentType(@Param("contentId") UUID contentId, @Param("contentType") EmbeddingContentType contentType);
    
    /**
     * Delete old embeddings older than specified date
     * @param olderThan the date threshold
     * @return number of deleted embeddings
     */
    @Modifying
    @Query("DELETE FROM Embedding e WHERE e.createdAt < :olderThan")
    int deleteOldEmbeddings(@Param("olderThan") OffsetDateTime olderThan);
    
    /**
     * Update embedding vector by ID
     * @param embeddingId the embedding ID
     * @param embeddingVector the new vector
     * @param embeddingModel the embedding model used
     */
    @Modifying
    @Query("UPDATE Embedding e SET e.embeddingVector = :embeddingVector, e.embeddingModel = :embeddingModel, " +
           "e.updatedAt = CURRENT_TIMESTAMP WHERE e.id = :embeddingId")
    void updateEmbeddingVector(@Param("embeddingId") UUID embeddingId, 
                              @Param("embeddingVector") String embeddingVector,
                              @Param("embeddingModel") String embeddingModel);
    
    /**
     * Find embeddings without vectors (null embedding_vector)
     * @param pageable pagination information
     * @return Page of embeddings without vectors
     */
    Page<Embedding> findByEmbeddingVectorIsNull(Pageable pageable);
    
    /**
     * Find embeddings that need re-processing (older than specified date and specific model)
     * @param olderThan the date threshold
     * @param embeddingModel the embedding model to filter by
     * @param pageable pagination information
     * @return Page of embeddings needing reprocessing
     */
    @Query("SELECT e FROM Embedding e WHERE e.createdAt < :olderThan AND e.embeddingModel = :embeddingModel")
    Page<Embedding> findEmbeddingsNeedingReprocessing(@Param("olderThan") OffsetDateTime olderThan,
                                                      @Param("embeddingModel") String embeddingModel,
                                                      Pageable pageable);
    
    /**
     * Check if content has any embeddings
     * @param contentId the content ID
     * @param contentType the content type
     * @return true if embeddings exist for the content
     */
    boolean existsByContentIdAndContentType(UUID contentId, EmbeddingContentType contentType);
}