export const validate = (schema: any) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        errors: error?.details?.map((e: any) => e.message),
        error: {
          message: error?.details?.map((e: any) => e.message)?.join("\n"),
        },
      });
    }

    next();
  };
};
