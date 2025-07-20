prompt = """You are a disaster evaluator. Below are 4 image analyses with damage scores (0 to 1) and explanations.
Choose which area/image represents the **most urgent situation** based on the information provided.
Return:
- Selected image path
- Damage score
- Original explanation
- Justification for the choice
{all_images_info}"""
