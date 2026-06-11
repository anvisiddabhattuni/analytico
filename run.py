import logging
import os

from app import create_app

log_level = logging.DEBUG if os.environ.get("FLASK_DEBUG") == "1" else logging.INFO
logging.basicConfig(level=log_level)
logger = logging.getLogger(__name__)

try:
    app = create_app()
    logger.info("Application created successfully")
except Exception as e:
    logger.error(f"Error creating application: {str(e)}")
    raise

if __name__ == "__main__":
    try:
        logger.info("Starting application...")
        port = int(os.environ.get("PORT", 5001))
        debug = os.environ.get("FLASK_DEBUG", "1") == "1"
        app.run(debug=debug, host="0.0.0.0", port=port)
    except Exception as e:
        logger.error(f"Error running application: {str(e)}")
        raise
