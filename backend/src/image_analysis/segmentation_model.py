from transformers import SegformerFeatureExtractor, SegformerForSemanticSegmentation

# Load model
def segmentation_model():
  extractor = SegformerFeatureExtractor.from_pretrained("nvidia/segformer-b5-finetuned-ade-640-640")
  model = SegformerForSemanticSegmentation.from_pretrained("nvidia/segformer-b5-finetuned-ade-640-640")
  return (model, extractor)
