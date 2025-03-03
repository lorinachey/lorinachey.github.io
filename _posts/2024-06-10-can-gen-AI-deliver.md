---
layout: post
title: "Can Generative AI deliver for Robotics?"
author: "Lorin Achey"
categories: facts
tags: [gen-ai]
image: scene-sense-diffusion-models.PNG
---

Diffusion models are pretty incredible and we are only just beginning to apply them in the robotics domain. We are applying diffusion models to help generate predicted geometry beyond occlusions. You can [read our manuscrcipt here](https://arxiv.org/abs/2403.11985)!

### Read the abstract from our latest submission:

"Abstract — When exploring new areas, robotic systems generally exclusively plan and execute controls over geometry that has been directly measured. When entering space that was previously obstructed from view such as turning corners in hallways or entering new rooms, robots often pause to plan over the newly observed space. To address this we present SceneSense, a real-time 3D diffusion model for synthesizing 3D occupancy information from partial observations that effectively predicts these occluded or out-of-view geometries for use in future planning and control frameworks. SceneSense uses a running occupancy map and a single RGB-D camera to generate predicted geometry around the platform at runtime, even when the geometry is occluded or out of view. Our architecture ensures that SceneSense never overwrites observed free or occupied space. By preserving the integrity of the observed map, SceneSense mitigates the risk of corrupting the observed space with generative predictions. While SceneSense is shown to operate well using a single RGB-D camera, the framework is flexible enough to extend to additional modalities. SceneSense operates as part of any system that generates a running occupancy map ‘out of the box’, removing conditioning from the framework. Alternatively, for maximum performance in new modalities, the perception backbone can be replaced and the model retrained for inference in new applications. Unlike existing models that necessitate multiple views and offline scene synthesis, or are focused on filling gaps in observed data, our findings demonstrate that SceneSense is an effective approach to estimating unobserved local occupancy information at runtime. Local occupancy predictions from SceneSense are shown to better represent the ground truth occupancy distribution during the test exploration trajectories than the running occupancy map. Finally, we analyze example predictions and show that SceneSense provides reasonable, accurate, and useful predictions."


