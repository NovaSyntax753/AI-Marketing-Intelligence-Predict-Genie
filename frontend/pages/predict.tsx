// import React, { useState } from 'react';
// import Layout from '@/components/Layout';
// import { predictEngagement, PredictPayload } from '@/lib/api';

// // Types
// interface FormData {
//   follower_count: number | '';
//   post_type: string;
//   // like_count: number | '';
//   // comment_count: number | '';
//   // repost_count: number | '';
//   hashtag_count: number | '';
//   mention_count: number | '';
//   cta_used: string;
// }

// interface PredictionResult {
//   predicted_engagement_score: number;
//   confidence_score: number;
// }

// // You can adjust this maxScore according to your model's max possible prediction
// const MAX_SCORE = 500; // Example: max raw score your model could output

// export default function Predict() {
//   const initialState: FormData = {
//     follower_count: '',
//     post_type: '',
//     // like_count: '',
//     // comment_count: '',
//     // repost_count: '',
//     hashtag_count: '',
//     mention_count: '',
//     cta_used: ''
//   };

//   const [formData, setFormData] = useState<FormData>(initialState);
//   const [prediction, setPrediction] = useState<PredictionResult | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [predicting, setPredicting] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     setFormData(prev => ({
//       ...prev,
//       [name]:
//         name === "post_type" || name === "cta_used"
//           ? value
//           : value === "" ? "" : Math.max(0, Number(value))
//     }));
//   };

//   const handleReset = () => {
//     setFormData(initialState);
//     setPrediction(null);
//     setError(null);
//   };

//   const validateForm = () => {
//     for (let key in formData) {
//       if (formData[key as keyof FormData] === '') {
//         return "Please fill all fields";
//       }
//     }

//     if ((formData.follower_count as number) <= 0) {
//       return "Followers must be greater than 0";
//     }

//     return null;
//   };

//   const handlePredict = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setError(null);
//     setPrediction(null);

//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setPredicting(true);

//     try {
//       const payload: PredictPayload = {
//         follower_count: Number(formData.follower_count),
//         post_type: formData.post_type.toLowerCase(),
//         // like_count: Number(formData.like_count),
//         // comment_count: Number(formData.comment_count),
//         // repost_count: Number(formData.repost_count),
//         hashtag_count: Number(formData.hashtag_count),
//         mention_count: Number(formData.mention_count),
//         cta_used: formData.cta_used.toLowerCase
//       };

//       const result = await predictEngagement(payload);

//       // ✅ Scale predicted score to 0-100
//       const scaledScore = Math.min(Math.max(result.predicted_engagement_score / MAX_SCORE * 100, 0), 100);

//       setPrediction({
//         ...result,
//         predicted_engagement_score: scaledScore
//       });

//     } catch (err: any) {
//       setError(err?.response?.data?.detail || "Prediction failed");
//     } finally {
//       setPredicting(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold text-center">
//           Predict Engagement
//         </h1>

//         {/* FORM */}
//         <form onSubmit={handlePredict} className="space-y-4">

//   <input
//     name="follower_count"
//     type="number"
//     placeholder="Followers Count"
//     value={formData.follower_count}
//     onChange={handleInputChange}
//     className="input-field"
//   />

//   <select
//     name="post_type"
//     value={formData.post_type}
//     onChange={handleInputChange}
//     className="input-field"
//   >
//     <option value="">Select Post Type</option>
//     <option value="image">Image</option>
//     <option value="video">Video</option>
//     <option value="carousel">Carousel</option>
//   </select>

//   <input
//     name="hashtag_count"
//     type="number"
//     placeholder="Hashtags Used"
//     value={formData.hashtag_count}
//     onChange={handleInputChange}
//     className="input-field"
//   />

//   <input
//     name="mention_count"
//     type="number"
//     placeholder="Mentions"
//     value={formData.mention_count}
//     onChange={handleInputChange}
//     className="input-field"
//   />

//   <select
//     name="cta_used"
//     value={formData.cta_used}
//     onChange={handleInputChange}
//     className="input-field"
//   >
//     <option value="">Select CTA</option>
//     <option value="no_cta">No CTA</option>
//     <option value="comment">Comment</option>
//     <option value="follow">Follow</option>
//   </select>

//   <button type="submit" className="btn-primary w-full">
//     Predict Engagement
//   </button>

// </form>

//         {/* ERROR */}
//         {error && <p className="text-red-500 text-center">{error}</p>}

//         {/* PREDICTION */}
//         {prediction && (
//           <div className="p-6 border rounded-lg text-center shadow">
//             <h2 className="text-lg font-semibold mb-2">Prediction Result</h2>

//             <p className="text-4xl font-bold text-green-600">
//               {prediction.predicted_engagement_score.toFixed(2)}
//             </p>

//             {/* <p className="text-sm text-gray-500 mt-2">
//               Confidence: {(prediction.confidence_score * 100).toFixed(2)}%
//             </p> */}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { predictEngagement, PredictPayload } from '@/lib/api';

interface FormData {
  follower_count: number | '';
  post_type: string;
  hashtag_count: number | '';
  mention_count: number | '';
  cta_used: string;
}

interface PredictionResult {
  predicted_engagement_score: number;
  confidence_score: number;
}

const MAX_SCORE = 500;

export default function Predict() {

  const initialState: FormData = {
    follower_count: '',
    post_type: '',
    hashtag_count: '',
    mention_count: '',
    cta_used: ''
  };

  const [formData, setFormData] = useState<FormData>(initialState);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        name === "post_type" || name === "cta_used"
          ? value
          : value === "" ? "" : Math.max(0, Number(value))
    }));
  };

  const handleReset = () => {
    setFormData(initialState);
    setPrediction(null);
    setError(null);
  };

  const validateForm = () => {
    for (let key in formData) {
      if (formData[key as keyof FormData] === '') {
        return "Please fill all fields";
      }
    }

    if ((formData.follower_count as number) <= 0) {
      return "Followers must be greater than 0";
    }

    return null;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setPrediction(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPredicting(true);

    try {
      const payload: PredictPayload = {
        follower_count: Number(formData.follower_count),
        post_type: formData.post_type.toLowerCase(),
        hashtag_count: Number(formData.hashtag_count),
        mention_count: Number(formData.mention_count),
        cta_used: formData.cta_used.toLowerCase() // ✅ FIXED
      };

      const result = await predictEngagement(payload);

      // const scaledScore = Math.min(
      //   Math.max((result.predicted_engagement_score / MAX_SCORE) * 100, 0),
      //   100
      // );
      const scaledScore = result.predicted_engagement_score * 100;
      setPrediction({
        ...result,
        predicted_engagement_score: scaledScore
      });

    } catch (err: any) {
      setError(err?.response?.data?.detail || "Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          Predict Engagement
        </h1>

        <form onSubmit={handlePredict} className="space-y-4">

          <input
            name="follower_count"
            type="number"
            placeholder="Followers Count"
            value={formData.follower_count}
            onChange={handleInputChange}
            className="input-field"
          />

          <select
            name="post_type"
            value={formData.post_type}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select Post Type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="carousel">Carousel</option>
          </select>

          <input
            name="hashtag_count"
            type="number"
            placeholder="Hashtags Used"
            value={formData.hashtag_count}
            onChange={handleInputChange}
            className="input-field"
          />

          <input
            name="mention_count"
            type="number"
            placeholder="Mentions"
            value={formData.mention_count}
            onChange={handleInputChange}
            className="input-field"
          />

          <select
            name="cta_used"
            value={formData.cta_used}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select CTA</option>
            <option value="no_cta">No CTA</option>
            <option value="comment">Comment</option>
            <option value="follow">Follow</option>
          </select>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary w-full">
              {predicting ? "Predicting..." : "Predict Engagement"}
            </button>

            <button type="button" onClick={handleReset} className="btn-secondary w-full">
              Reset
            </button>
          </div>

        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {prediction && (
          <div className="p-6 border rounded-lg text-center shadow">
            <h2 className="text-lg font-semibold mb-2">Prediction Result</h2>

            <p className="text-4xl font-bold text-green-600">
              {prediction.predicted_engagement_score.toFixed(2)}
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
}