import numpy as np
import pandas as pd

MIN_ANSWER_KEY_WEIGHT = 0.4
SCORE_SMOOTHING_ALPHA = 0.03

class EntropyWeight:
    def calculate(self, criteria_data):
        print("Calculate Adaptive Weight")
        print(criteria_data)
        # Create a DataFrame from the criteria data
        df = pd.DataFrame(criteria_data)

        if all(len(v) == 1 for v in criteria_data.values()):
            # If yes, return the original scores and assign equal weights to each criterion
            scores = df.values.flatten()
            weights = {k: 1/len(criteria_data) for k in criteria_data.keys()}
            return scores, weights

        # Calculate the total scores for each criterion
        total_scores = df.sum()

        # Calculate the proportions of each criterion's score relative to the total
        proportions = df / total_scores

        # Ensure that proportions are within the valid range [0, 1]
        proportions = np.clip(proportions, a_min=1e-10, a_max=1.0)

        # Calculate entropy for each criterion
        entropy = -proportions * np.log2(proportions)

        # Calculate the relative entropy
        relative_entropy = entropy.sum() / np.log2(len(df))

        # Calculate the initial weights
        weights = 1 - relative_entropy

        # Ensure that the weight of the first criterion is at least 0.4
        weights.iloc[0] = max(weights.iloc[0], MIN_ANSWER_KEY_WEIGHT)

        # Normalize the weights to ensure the sum is 1
        normalized_weights = weights / weights.sum()

        # Apply Laplace smoothing to ensure a more balanced distribution
        smoothed_weights = self.apply_laplace_smoothing(normalized_weights)
        # smoothed_weights = normalized_weights

        # Convert the smoothed weights to an array
        criteria_weights = smoothed_weights.values

        # Calculate the final assessment based on the criteria weights
        scores = df.values.dot(criteria_weights)

        weights = smoothed_weights.to_dict()

        return scores, weights

    def apply_laplace_smoothing(self, weights, alpha=SCORE_SMOOTHING_ALPHA):
        num_criteria = len(weights)
        smoothed_weights = [(weight + alpha) / (1 + alpha * num_criteria) for weight in weights]

        return pd.Series(smoothed_weights, index=weights.index)