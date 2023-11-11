from torch.utils.data import DataLoader
from sentence_transformers import SentenceTransformer, InputExample, losses
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator
from sklearn.model_selection import train_test_split
import pandas as pd

# Load the dataset
df = pd.read_csv('./training-data/essay-training-data.csv')

# Split the dataset into train and test sets
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

# Prepare the data for training
train_examples_1 = [InputExample(texts=[row['kunci jawaban'], row['jawaban']], label=float(row['score 1'])) for _, row in train_df.iterrows()]
train_examples_2 = [InputExample(texts=[row['kunci jawaban'], row['jawaban']], label=float(row['score 2'])) for _, row in train_df.iterrows()]
train_examples_3 = [InputExample(texts=[row['kunci jawaban'], row['jawaban']], label=float(row['score 3'])) for _, row in train_df.iterrows()]

test_examples_1 = [InputExample(texts=[row['kunci jawaban'], row['jawaban']], label=float(row['score 1'])) for _, row in test_df.iterrows()]
test_examples_2 = [InputExample(texts=[row['kunci jawaban'], row['jawaban']], label=float(row['score 2'])) for _, row in test_df.iterrows()]
test_examples_3 = [InputExample(texts=[row['kunci jawaban'], row['jawaban']], label=float(row['score 3'])) for _, row in test_df.iterrows()]

# Combine all training examples
train_examples = train_examples_1 + train_examples_2 + train_examples_3

# Combine all testing examples
test_examples = test_examples_1 + test_examples_2 + test_examples_3

# Prepare the data for evaluation
sentences1 = [example.texts[0] for example in test_examples]
sentences2 = [example.texts[1] for example in test_examples]
scores = [example.label for example in test_examples]

# Define the batch size and the number of epochs
batch_size = 16
num_epochs = 4

# Load a pre-trained SentenceTransformer model
model = SentenceTransformer('../model/sentence-similarity-model-base')

# Define the dataloaders for train and test sets
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=batch_size)

# Define the training procedure
train_loss = losses.CosineSimilarityLoss(model=model)

# Define the evaluator
evaluator = EmbeddingSimilarityEvaluator(sentences1, sentences2, scores)

# Fine-tune the model
model.fit(train_objectives=[(train_dataloader, train_loss)], epochs=num_epochs, warmup_steps=100, evaluator=evaluator, evaluation_steps=1000)

model.save('../model/sentence-similarity-fine-tuned-model')
