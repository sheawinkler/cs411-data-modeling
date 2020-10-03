
// remove all nodes and relationships
MATCH (n)
    DETACH DELETE n;

// author columns: 'author_ID','author_name', 'MEIBI','MEIBIX','avg_words_perpost','avg_words_perpost_nostopwords'
// LOAD author.csv (note that the URL path is different based on environment)
LOAD CSV FROM "http://localhost:11001/project-5c23e13a-df4f-4cc3-929f-52bace6b96ef/authors.csv" AS line 
	MERGE (p:Author {
    	author_id: toInteger(line[0]),
        author_name: line[1],
        meibi: toFloat(line[2]),
        meibix: toFloat(line[3]),
        avg_words_perpost: toFloat(line[4]),
        avg_words_perpost_nostopwords: toFloat(line[5])
    });


// [0]'post_ID',[1]'title',[2]'author_Name',[3]'author_id',[4]'num_comments',
// [5]'post_content',[6]'URL',[7]'date',[8]'num_retrieved_inlinks',[9]'num_retrieved_comments',
// [10]'post_length',[11]'post_length_no_stopwords', [12]'avg_word_length',[13]'avg_word_length_no_stopwords',[14]'MEIBI',[15]'MEBIX'
LOAD CSV FROM "http://localhost:11001/project-5c23e13a-df4f-4cc3-929f-52bace6b96ef/post-small.csv" AS line 
    MATCH (a:Author { author_id: toInteger(line[3])})
    MERGE (p:Post {
    	post_id: toInteger(line[0]),
        title: coalesce(line[1], ""),
		num_comments: toInteger(line[4]), 
        post_content: coalesce(line[5], ""),
        url: line[6],
        date: line[7],
        num_retrieved_inlinks: toInteger(line[8]),
        num_retrieved_comments: toInteger(line[9]),
        post_length: toInteger(line[10]),
        post_length_no_stopwords: toInteger(line[11]),
        avg_word_length: toFloat(line[12]),
        avg_word_length_no_stopwords: toFloat(line[13]),
        meibi: toFloat(line[14]),
        mebix: toFloat(line[15])
    })
    CREATE (a)-[:WRITES]->(p)
    CREATE (p)-[:WRITTEN_BY]-> (a);

// ['comment_ID','post_ID','comment_content','comment_author','created_date','vote']
LOAD CSV FROM "http://localhost:11001/project-5c23e13a-df4f-4cc3-929f-52bace6b96ef/comments-small.csv" as line
    MATCH (p:Post { post_id: toInteger(line[1]) })
    MERGE (c:Comment {
        comment_id     : toInteger(line[0]),
        comment_content: coalesce(toInteger(line[2]), ""),
        comment_author : coalesce(toInteger(line[3]), ""),
        created_date   : coalesce(line[4], ""),
        vote           : coalesce(line[5], 0)
    })
    CREATE (p)-[:HAS_COMMENT]->(c)
    CREATE (c)-[:BELONG_TO]->(p);

// ['inlink_ID','post_ID','title','author','date','URL']
LOAD CSV FROM "http://localhost:11001/project-5c23e13a-df4f-4cc3-929f-52bace6b96ef/inlinks-small.csv" as line
    MATCH (p:Post { post_id: toInteger(line[1]) })
    MERGE (i:Inlink {
        inlink_id     : toInteger(line[0]),
        title         : coalesce(line[2], ""),
        author        : line[3],
        date          : coalesce(line[4], ""),
        url           : coalesce(line[5], "") 
    })
    CREATE (p)-[:HAS_INLINK]->(i)
    CREATE (i)-[:BELONG_TO]->(p);